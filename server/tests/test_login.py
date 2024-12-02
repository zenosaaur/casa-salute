from unittest.mock import patch
import json
from conftest import values 
from app.repositories.utente_repository import UtenteRepository
from app.extensions import db
from app.models import medico as MedicoModel
from flask_jwt_extended import create_access_token

def test_login_success(client):
    obj = UtenteRepository(db.session)

    with patch.object(obj, 'login') as mock_query:
        mock_user = mock_query.return_value.first.return_value
        mock_user.id_utente = values["id_utente"]

        with patch('app.models.medico.query.filter_by') as mock_medico_query:
            mock_medico_query.return_value.first.return_value = True

            response = client.post('/login', data=json.dumps({
                    'email': 'ste@gmail.com',
                    'password': 'test'
                }), content_type='application/json')

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['utente'] == values['id_utente']
            assert json_data['ruolo'] == "medico"
            

def test_login_failure(client):
    obj = UtenteRepository(db.session)
    
    with patch.object(obj, 'login') as mock_query:
        mock_query.return_value.first.return_value = None

        response = client.post('/login', data=json.dumps({
            'email': 'wrong@example.com',
            'password': 'wrongpassword'
        }), content_type='application/json')

        assert response.status_code == 401
        json_data = response.get_json()
        assert json_data['message'] == "Credenziali non valide"
