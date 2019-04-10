import subprocess
import os


app_configs = None
db_engine = None

def serve_configs_to_db_migration(configs):
    print('Serve configs in db migration')
    global app_configs
    app_configs = configs

def serve_db_engine_to_migration(engine):
    print('Serve db engine to db migration')
    global db_engine
    db_engine = engine


def upgrade_database():
    print('Upgrading database')
    os.system("python db/feedbuzz_migration/manage.py upgrade {} db/feedbuzz_migration".format(app_configs.DATABASE_URL))

def check_for_migration_setup():
    if not db_engine.dialect.has_table(db_engine, 'migrate_version'):
        print('Version control database')
        os.system('python db/feedbuzz_migration/manage.py version_control {} db/feedbuzz_migration'.format(app_configs.DATABASE_URL))