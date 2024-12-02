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

def test_create_prelievimedicazioni(client, token):
    with patch('app.models.prelievimedicazioni.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/prelievomedicazione', data=json.dumps({
                "id_paziente": values['id_paziente'],
                "id_infermiere": values['id_infermiere'],
                "datainizio": "2024-06-27T15:30:00.000Z",
                "esito": None,
                "note": None,
                "id_tiposala": values['id_tiposala']
            }), headers=headers)

            
            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Prelievo o medicazione creata con successo'

def test_update_prelievimedicazioni(client, token):
    with patch('app.models.prelievimedicazioni.query.filter_by') as mock_query:
        mock_visita = mock_query.return_value.first.return_value
        mock_visita.id_prelievomedicazione = values["id_prelievomedicazione"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/prelievomedicazione/' + values["id_prelievomedicazione"], data=json.dumps({
                "id_paziente": values['id_paziente'],
                "id_infermiere": values['id_infermiere'],
                "datainizio": "2024-06-27T15:30:00.000Z",
                "esito": None,
                "note": None,
                "id_tiposala": values['id_tiposala']
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Prelievo o medicazione aggiornata con successo'
