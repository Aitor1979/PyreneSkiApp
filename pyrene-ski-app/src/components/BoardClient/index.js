import React from 'react'
import '../../template/index.sass'


export default function({user, onBookLesson, onMyCart, onLogout }) {

return <section className="board client">
        <h4 className="client__user">{user}</h4>
        <h3 className="client__lessontobook"><a href="/book-lesson" onClick={event => { event.preventDefault(); onBookLesson() }}>Book lessons</a></h3>
        <h3 className="client__mycart"><a href="/my-cart" onClick={event => { event.preventDefault(); onMyCart() }}>My Cart</a></h3>
    
        <section className="logo">
        <img className="logo__image" src="./images/ski_silouette_white_shadow.png" alt="skier silouette"/>
        </section>
        <h3 className="client__logout"><a href="/logout" onClick={event => { event.preventDefault(); onLogout()}}>Logout</a></h3>
    
    </section>

}