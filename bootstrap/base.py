from abc import ABC, abstractmethod
from utils import AppNeedsProvider

class BaseApplication(ABC):

    def __init__(self):
        self._app_needs_provider = AppNeedsProvider()

    def start(self):
        self.__provide_needs__()
        self._before_start()
        self._on_start()

    def __provide_needs__(self):
        provide_funcs = self._get_needs_providing_func()
        self._app_needs_provider.provide_app_needs(provide_funcs)

    def _before_start(self):
        pass

    @abstractmethod
    def _on_start(self):
        pass

    @abstractmethod
    def _get_needs_providing_func(self):
        pass