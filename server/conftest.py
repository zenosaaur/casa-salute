import pytest
from main import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            yield client


values = {
    "id_utente": "a269287d-b7b3-43fb-9e1c-914ef4f014a9",
    "id_visita": "1277c084-3549-4f31-85fc-e1687bbebce9",
    "id_tiposala": "6edf4c89-93d4-4380-a280-a1acc27f53e4",
    "id_tipovisita": "33879281-15da-4bc7-8498-832aa00e66fa",
    "id_tipoambulatorio": "b4ce9a1f-8e41-443f-8b4a-814fb7412d64",
    "id_serviziosala": "fa1cf7c2-1fea-43ef-bba1-fd35d9dd2d2e",
    "id_infermiere": "5bc38f38-fade-4930-9307-095ac89144a8",
    "id_infermiere2": "8b020908-7e9d-4e58-9e75-66e138235f54",
    "id_segretaria": "472ca394-f8fb-4485-a7a9-c0b51afae07a",
    "id_utente_notExist": "3bebe1d5-c0bf-45a0-a9ce-35b51ae38e32",
    "id_responsabile": "6c76dc29-5720-4243-95af-ada314f9c7d5",
    "id_paziente": "a2b6e9dd-9862-4e99-bea4-074343fed486",
    "id_prelievomedicazione": "d631c968-1365-451c-9447-689865073711",
    "id_medico": "277dd171-26ac-4655-b109-28285707255e",
    "id_medico2": "9157f424-933d-4712-92da-a724b162b825",
    "id_medico3": "3a20a8c2-bc1a-4383-8054-028a2fce9014",
    "id_medicosostituzione": "580f5314-4468-41b3-9f72-b00aa586b5c7",
    "id_medicosostituto2": "d45beb56-3f9a-43c1-90b5-a5e1f4ca67d8",
    "id_medicosostituto3": "829581bb-e0b2-4c63-ae35-9e139da79b1c",
    "id_assenza": "d7dad45d-3666-4ca0-ab58-7bc25df60442"
}