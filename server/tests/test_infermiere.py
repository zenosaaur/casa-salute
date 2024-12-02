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

def test_create_infermiere(client, token):
    with patch('app.models.infermiere.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/infermiere', data=json.dumps({
                'nome': 'John',
                'cognome': 'Doe',
                'email': 'gggggg@example.com',
                'password': 'password',
                'codicefiscale': 'XYZ123',
                'data': '2000-01-01',
                'luogonascita': 'City'
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Infermiere e utente creati con successo'

def test_create_infermiereFromUtente(client, token):
    with patch('app.models.infermiere.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/infermiere/'+values['id_utente_notExist'], data=json.dumps({
                'specializzazione': 'Psichiatra',
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Infermiere creato con successo'

