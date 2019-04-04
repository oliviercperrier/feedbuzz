from abc import ABC, abstractmethod
from assets import AppNeedsProvider
from sanic_jwt import Authentication, utils as sanic_utils, endpoints, Initialize, exceptions
from sanic_jwt import BaseEndpoint
from sanic_jwt import Responses
from sanic_jwt.decorators import protected
import uuid

class BaseApplication(ABC):

    def __init__(self):
        self._app_needs_provider = AppNeedsProvider()

    def start(self):
        self.__provide_needs__()
        self._on_start()
        

    def __provide_needs__(self):
        provide_funcs = self._get_needs_providing_func()
        self._app_needs_provider.provide_app_needs(provide_funcs)

    @abstractmethod
    def _on_start(self):
        pass

    @abstractmethod
    def _get_needs_providing_func(self):
        pass

class FeedbuzzAuthentication(Authentication):

    async def generate_refresh_token(self, request, user, identifier):
        refresh_token = await sanic_utils.call(self.config.generate_refresh_token())
        user_id = await self._get_user_id(user)
        await sanic_utils.call(
            self.store_refresh_token,
            user_id=user_id,
            refresh_token=refresh_token,
            request=request,
            identifier=identifier
        )
        return refresh_token

class FeedbuzzAuthenticateEndpoint(BaseEndpoint):

    async def post(self, request, *args, **kwargs):
        request, args, kwargs = await self.do_incoming(request, args, kwargs)

        config = self.config
        user = await sanic_utils.call(
            self.instance.auth.authenticate, request, *args, **kwargs
        )

        access_token, output = await self.responses.get_access_token_output(
            request, user, self.config, self.instance
        )

        identifier = request.json.get('identifier', str(uuid.uuid1()))

        if config.refresh_token_enabled():
            refresh_token = await sanic_utils.call(
                self.instance.auth.generate_refresh_token,
                request=request,
                user=user,
                identifier=identifier
            )
            output.update({config.refresh_token_name(): refresh_token})
        else:
            refresh_token = None

        output.update(
            self.responses.extend_authenticate(
                request,
                user=user,
                access_token=access_token,
                refresh_token=refresh_token,
                identifier=identifier
            )
        )

        output = await self.do_output(output)

        resp = self.responses.get_token_reponse(
            request,
            access_token,
            output,
            refresh_token=refresh_token,
            config=self.config,
        )

        return await self.do_response(resp)

class FeedbuzzReponseClass(Responses):
    @staticmethod
    def extend_authenticate(request,
                            user=None,
                            access_token=None,
                            refresh_token=None,
                            identifier=None):
        return {
            'identifier': str(identifier) 
        }

class FeedbuzzRefreshEndpoint(BaseEndpoint):
    decorators = [protected(verify_exp=False)]

    async def post(self, request, *args, **kwargs):
        request, args, kwargs = await self.do_incoming(request, args, kwargs)

        payload = self.instance.auth.extract_payload(request, verify=False)

        try:
            user = await sanic_utils.call(
                self.instance.auth.retrieve_user, request, payload=payload
            )
        except exceptions.MeEndpointNotSetup:
            message = "Refresh tokens have not been enabled properly."
            "Perhaps you forgot to initialize with a retrieve_user handler?"
            raise exceptions.RefreshTokenNotImplemented(message=message)

        identifier = request.json.get('identifier', '')
        user_id = await self.instance.auth._get_user_id(user)
        refresh_token = await sanic_utils.call(
            self.instance.auth.retrieve_refresh_token,
            request=request,
            user_id=user_id,
            identifier=identifier
        )
        if isinstance(refresh_token, bytes):
            refresh_token = refresh_token.decode("utf-8")

        token = await self.instance.auth.retrieve_refresh_token_from_request(
            request
        )

        if refresh_token != token:
            raise exceptions.AuthenticationFailed()

        access_token, output = await self.responses.get_access_token_output(
            request, user, self.config, self.instance
        )

        output.update(
            self.responses.extend_refresh(
                request,
                user=user,
                access_token=access_token,
                refresh_token=refresh_token,
                purported_token=token,
                payload=payload,
            )
        )
        output = await self.do_output(output)

        resp = self.responses.get_token_reponse(
            request, access_token, output, config=self.config
        )

        return await self.do_response(resp)