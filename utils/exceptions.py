from sanic.exceptions import SanicException, add_status_code

@add_status_code(303)
class LegacyEndpointException(SanicException):
    pass