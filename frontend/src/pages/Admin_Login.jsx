import { useEffect } from 'react';
import { setLoading, setUser } from '../redux/slice/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { validateEmail } from '../utils/validateEmail';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ADMIN_API_END_POINT } from '../utils/apiEndPoints';

const Admin_Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { loading, user } = useSelector((store) => store.auth);
    const [input, setInput] = useState({
        email: '',
        password: '',
    });
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateEmail(input.email)) {
            toast.error('Please enter valid email');
            return;
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${ADMIN_API_END_POINT}/admin-login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.admin))
                const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectPath);
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    })
    return (
        <div>
            <div>
                <div className='flex items-center justify-center '>
                    <div className="w-full max-w-sm card shrink-0">

                        <div className="card-body">
                            <h1 className='text-xl text-center'>Sign In</h1>
                            <form onSubmit={submitHandler} className='flex flex-col gap-5 '>
                                <div className="fieldset">
                                    <div>
                                        <label className="label">Email</label>
                                        <input type="email"
                                            name='email'
                                            value={input.email}
                                            onChange={changeEventHandler}
                                            className="input" placeholder="user@email.com" />
                                    </div>
                                    <div>
                                        <label className="label">Password</label>
                                        <input type="password"
                                            name='password'
                                            value={input.password}
                                            className="input"
                                            onChange={changeEventHandler}
                                            placeholder="Password" />
                                    </div>
                                </div>
                                {loading ? <button className='mt-4 btn btn-neutral'><span className="loading loading-spinner loading-lg"></span></button> :
                                    <button type='submit' className=" btn btn-neutral">Login</button>
                                }

                                <div className="flex items-center">
                                    Already have an account?
                                    <Link to='/admin-signup' className="ml-2 link link-primary">
                                        Admin-Signup
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default Admin_Login