const fs = require('fs');

let users = require('data/users.json');

export const usersRepo = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function getAll() {
    return users;
}

function getById(id) {
    return users.find(x => x.id.toString() === id.toString());
}

function create({ title, firstName, lastName, email, role, password }) {
    const user = { title, firstName, lastName, email, role, password };

    // validação
    if (users.find(x => x.email === user.email))
        throw `User with the email ${user.email} already exists`;

    // gerando novo id para o user
    user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;

    //definir data criada e atualizada
    user.dateCreated = new Date().toISOString();
    user.dateUpdated = new Date().toISOString();

    // add e salavar user
    users.push(user);
    saveData();
}

function update(id, { title, firstName, lastName, email, role, password }) {
    const params = { title, firstName, lastName, email, role, password };
    const user = users.find(x => x.id.toString() === id.toString());

    // validação
    if (params.email !== user.email && users.find(x => x.email === params.email))
        throw `User with the email ${params.email} already exists`;

    //só atualizar a senha se digitada
    if (!params.password) {
        delete params.password;
    }

    //definir data atualizada
    user.dateUpdated = new Date().toISOString();

    //atualizar e salvar
    Object.assign(user, params);
    saveData();
}

//prefixado com underline '_' porque 'delete' é uma palavra reservada em javascript
function _delete(id) {
    //filtrar usuário excluído e salvar
    users = users.filter(x => x.id.toString() !== id.toString());
    saveData();
    
}

//funções auxiliares privadas

function saveData() {
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 4));
}