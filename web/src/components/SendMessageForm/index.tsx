import { FormEvent, useContext, useEffect, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../context/auth';
import { api } from '../../services/api';

import styles from './styles.module.scss';

export function SendMessageForm() {

    const {user, signOut} = useContext(AuthContext);
    const [message, setMessage] = useState('');

    async function sendMessage(event: FormEvent) {
        event.preventDefault();

        const trimMessage = message.trim()
        if(!trimMessage) return

        await api.post('messages', {message: trimMessage})

        setMessage('')
    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button className={styles.signOutButton} onClick={signOut} >
                <VscSignOut size='32'/>
            </button>

            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size='16'/>
                    {user?.login}
                </span>
            </header>

            <form onSubmit={sendMessage} className={styles.sendMessageForm}>
                <label htmlFor="message">Mensagem</label>
                <textarea name="message" id="message" placeholder='Qual a sua expectativa para o evento?' value={message} onChange={event => setMessage(event.target.value)}/>

                <button type='submit'>Enviar mensagem</button>
            </form>
        </div>
    )
}