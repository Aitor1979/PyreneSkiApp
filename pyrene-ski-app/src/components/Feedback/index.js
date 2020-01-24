import React from 'react'
import '../../template/index.sass'

export default function({ message }) {

    return <section className="feedback">
        <span className="feedback__icon" role="img" aria-label="thumbs down">👎🏼</span>
        <p className="feedback__message">{message}</p>
        <span className="feedback__icon" role="img" aria-label="thumbs down">👎🏼</span>
    </section>
}
