import React from "react";
import PropTypes from "prop-types"

function ValidationErrors(props) {
    return (
        props.errorMessages.map(e => <p style={{ color: "maroon" }} key={e.id}>{e.message}</p>)
    )
}

ValidationErrors.propTypes = {
    errorMessages: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        message: PropTypes.string
    }))
}

export default ValidationErrors;