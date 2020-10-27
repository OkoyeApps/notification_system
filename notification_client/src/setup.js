import React, { useState } from 'react';

const Setup = ({ setUserId }) => {
    const [value, setValue] = useState(null);
    const next = () => {
        setUserId(value);
        window.location.href = window.location.href + "#" + value
    };

    const changeValue = (e) => {
        setValue(e.target.value);
    };


    return (
        <div id="notifPage">
            <form className="border-0 justify-content-centre d-flex">
                <label className="sr-only" htmlFor="inlineFormInputName2">Enter User Id</label>
                <input onChange={changeValue} type="text" className="form-control mb-2 mr-sm-2" id="inlineFormInputName2" placeholder="Enter user id e.g 1" />

                <button type="button" className="btn btn-primary mb-2" onClick={next}>Proceed</button>
            </form>
        </div>
    );
};

export default Setup;