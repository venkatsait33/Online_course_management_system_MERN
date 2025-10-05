import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { USER_API_END_POINT } from '../utils/apiEndPoints';
import { setUser, setLoading } from '../redux/slice/authSlice';
import { validateEmail } from '../utils/validateEmail';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ✅ Use Redux loading from store
    const { loading } = useSelector((store) => store.auth);

    const [input, setInput] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateEmail(input.email)) {
            toast.error('Please enter valid email');
            return;
        }
        if (!input.role) {
            toast.error('Please select role');
            return;
        }
        if (!input.phoneNumber) {
            toast.error('Please fill phoneNumber');
            return;
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectPath);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className='flex items-center justify-center'>
            <div className="w-full max-w-sm card shrink-0">
                <div className="card-body">
                    <h1 className='text-xl text-center'>Sign Up</h1>

                    <form onSubmit={submitHandler} className='flex flex-col gap-5'>
                        <div className="fieldset">
                            <div>
                                <label className="label">User Name</label>
                                <input type="text" name='fullname' className="input"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    placeholder="User Name" />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input type="email"
                                    name='email'
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="input" placeholder="user@email.com" />
                            </div>
                            <div>
                                <label className="label">Phone Number</label>
                                <input type="number"
                                    name='phoneNumber'
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="input" placeholder="0987654321" />
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <input type="password"
                                    name='password'
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    className="input"
                                    placeholder="Password" />
                            </div>
                            <div className='flex items-center gap-2 mt-2'>
                                <div className='flex items-center gap-2'>
                                    <input type="radio" name="role"
                                        value='student' className="radio"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                    />
                                    <p>Student</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <input type="radio" name="role" value='instructor'
                                        checked={input.role === 'instructor'}
                                        onChange={changeEventHandler}
                                        className="radio" />
                                    <p>Instructor</p>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <button className='mt-4 btn btn-neutral'>
                                <span className="loading loading-spinner loading-lg"></span>
                            </button>
                        ) : (
                            <button type='submit' className="btn btn-neutral">Register</button>
                        )}

                        <div className="flex items-center">
                            Already have an account?
                            <Link to='/login' className="ml-2 link link-primary">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
