from api import serve_configs_api
from db import serve_configs_db
from configs import ConfigurationLoader
from sqlalchemy import create_engine

class AppNeedsProvider():

    def __init__(self):
        config_l = ConfigurationLoader()
        self._app_configs = config_l.load_config()

    def provide_app_needs(self, provide_funcs):
        configs_funcs = provide_funcs['configs_funcs']
        engine_funcs = provide_funcs['engine_funcs']

        # MUST PROVIDE DB ENGINE BEFORE CONFIG !!!!!!!!!
        self.__provide_db_engine__(engine_funcs)
        self.__provide_configs__(configs_funcs)

    def __provide_configs__(self, provide_funcs):

        for func in provide_funcs:
            func(self._app_configs)
 
    def __provide_db_engine__(self, provide_funcs):
        engine = create_engine(self._app_configs.DATABASE_URL, pool_size=20)

        for func in provide_funcs:
            func(engine)