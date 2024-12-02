import json
from unittest.mock import patch
from flask_jwt_extended import create_access_token
import pytest
from conftest import values 
from app.extensions import db

@pytest.fixture
def token(client):
    user_identity = 'ste@gmail.com'  
    return create_access_token(identity=user_identity)

def test_create_visita(client, token):
    with patch('app.models.visita.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/visita', data=json.dumps({
                'id_paziente': '19e10bd5-ed9b-49f2-9bb8-a4e1b70f4316',
                'id_medico': '277dd171-26ac-4655-b109-28285707255e',
                'datainizio': '2024-08-12T08:30:00.000Z',
                'urgenza': None,
                'esito': None,
                'regime': None,
                'id_tipovisita': None,
                'id_tipoambulatorio': 'b4ce9a1f-8e41-443f-8b4a-814fb7412d64'
            }), headers=headers)

            
            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Visita creata con successo'

def test_update_visita(client, token):
    with patch('app.models.visita.query.filter_by') as mock_query:
        mock_visita = mock_query.return_value.first.return_value
        mock_visita.id_visita = values["id_visita"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/visita/' + values["id_visita"], data=json.dumps({
                'id_paziente': '19e10bd5-ed9b-49f2-9bb8-a4e1b70f4316',
                'id_medico': '277dd171-26ac-4655-b109-28285707255e',
                'datainizio': '2024-08-12T08:30:00.000Z',
                'urgenza': None,
                'esito': None,
                'regime': None,
                'id_tipovisita': None,
                'id_tipoambulatorio': 'b4ce9a1f-8e41-443f-8b4a-814fb7412d64'
            }), headers=headers)

            print(response.get_json())

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Visita aggiornata con successo'
