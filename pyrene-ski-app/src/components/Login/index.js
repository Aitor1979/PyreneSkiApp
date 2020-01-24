import React from 'react'
import '../../template/index.sass'
import Feedback from '../Feedback'

export default function({ onLogin, onBack, error }) {
    return <section className="login">
        
        <h3 className="login__title">Login</h3>
        <form className="login__form" onSubmit={function (event) { 
            event.preventDefault()

            const { username: { value: username }, password: { value: password } } = event.target

            onLogin(username, password)      
        }}>
            <input className="login__field" type="username" name="username" placeholder="username"/>
            <input className="login__field" type="password" name="password" placeholder="password"/>
            <button className="login__button">Submit</button>
            <a className="login__back" href="/" onClick={event => {
                        event.preventDefault()

                        onBack()
                    }}>Go Back</a>
        </form>

        {error && <Feedback message={error} />}
</section>

}