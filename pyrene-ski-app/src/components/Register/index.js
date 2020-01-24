import React from 'react'
import '../../template/index.sass'
import Feedback from '../Feedback'

export default function({ onRegister, onBack, error }) {
    return <section className="register">

        <h3 className="register__title">REGISTER</h3>
        <form className="register__form" onSubmit={function (event) {
            event.preventDefault()

            const { name: { value: name }, surname: { value: surname }, email: { value: email }, username: { value: username }, password: { value: password } } = event.target

            onRegister(name, surname, email, username, password)
        }}>
            <input className="register__field" type="text" name="name" placeholder="name"/>
            <input className="register__field" type="text" name="surname" placeholder="surname"/>
            <input className="register__field" type="email" name="email" placeholder="e-mail"/>
            <input className="register__field" type="username" name="username" placeholder="username"/>
            <input className="register__field" type="password" name="password" placeholder="password"/>
            <button className="register__button">Submit</button>
            <a className="register__back" href="/" onClick={event => {
                        event.preventDefault()

                        onBack()
                    }}>Go back</a>
        </form>

        {error && <Feedback message={error} />}
</section>

}