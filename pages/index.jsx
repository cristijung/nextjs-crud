import { Link } from 'components';

export default Home;

function Home() {
    return (
        <div>
            <h1>Next.js: CRUD + Hooks</h1>
            <p>
                Um App de exemplo mostrando como listar, adicionar, editar e excluir 
                registros de usuário com Next.js 10 e a biblioteca React Hook Form.
            </p>
            <p><Link href="/users">&gt;&gt; Gerenciando usuários</Link></p>
        </div>
    );
}
