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
            <form class="border-0 justify-content-centre d-flex">
                <label class="sr-only" htmlFor="inlineFormInputName2">Enter User Id</label>
                <input onChange={changeValue} type="text" class="form-control mb-2 mr-sm-2" id="inlineFormInputName2" placeholder="Enter user id e.g 1" />

                <button type="button" class="btn btn-primary mb-2" onClick={next}>Proceed</button>
            </form>
        </div>
    );
};

export default Setup;