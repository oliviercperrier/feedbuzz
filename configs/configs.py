import json
import os
		

class Configuration(object):

	def __init__(self,config=None):
		self.__config = {}
		self.__load_config(config)

	def __load_config(self, config):
		self.__config = config
		keys = list(config.keys())

		for i in range(len(keys)):
			if isinstance(config[keys[i]], dict):
				self.__config[keys[i]] = Configuration(config=config[keys[i]])

	def __getattr__(self, name):
		try:
			if name in self.__config:
				return self.__config[name]
		except:
			raise AttributeError("Configs do not exist")


class ConfigurationLoader(object):

	def load_config(self):
		env = os.environ.get('ENV')
		env_config_file_name =  'configs/configs.{}.json' 
		env_configs = None
		if env == 'PROD':
			env_configs = os.environ
		else:
			with open(env_config_file_name.format(env)) as f:
				env_configs = json.load(f)
		return Configuration(env_configs)		
