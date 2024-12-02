from flask import Flask
from .resources import utente_routes
from .resources import infermieri_routes
from .resources import medici_routes
from .resources import assenze_routes
from .resources import tipo_visita_routes
from .resources import servizio_sala_routes
from .resources import medico_sostituto_routes
from .resources import responsabile_routes
from .resources import tipo_ambulatorio_routes
from .resources import prelievi_medicazioni_routes
from .resources import segretaria_routes
from .resources import visite_routes
from .resources import pazienti_routes
from .resources import tipo_sala_routes
from .extensions import init_app
from dotenv import load_dotenv
from os import getenv

load_dotenv()


def create_app(config_object='app.config.'+getenv('CONFIG', 'Config')):
    app = Flask(__name__)
    app.config.from_object(config_object)

    init_app(app)

    app.register_blueprint(utente_routes.bp)
    app.register_blueprint(medici_routes.bp)
    app.register_blueprint(infermieri_routes.bp)
    app.register_blueprint(assenze_routes.bp)
    app.register_blueprint(tipo_visita_routes.bp)
    app.register_blueprint(servizio_sala_routes.bp)
    app.register_blueprint(medico_sostituto_routes.bp)
    app.register_blueprint(responsabile_routes.bp)
    app.register_blueprint(tipo_ambulatorio_routes.bp)
    app.register_blueprint(prelievi_medicazioni_routes.bp)
    app.register_blueprint(segretaria_routes.bp)
    app.register_blueprint(visite_routes.bp)
    app.register_blueprint(pazienti_routes.bp)
    app.register_blueprint(tipo_sala_routes.bp)
    return app
