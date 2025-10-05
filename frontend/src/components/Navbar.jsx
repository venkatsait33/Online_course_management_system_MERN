import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { USER_API_END_POINT } from '../utils/apiEndPoints'
import { setUser } from '../redux/slice/authSlice'
import { toast } from 'react-toastify'

const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="flex-1 navbar-start">
                    <Link to='/' className="btn btn-ghost text-base">Course Management System</Link>
                </div>
                <div className="flex gap-2 justify-center items-center navbar-center">
                    <div>
                        <Link to='/browse' className='btn btn-ghost'>
                            Browse Course
                        </Link>
                    </div>
                </div>
                <div className='navbar-end flex gap-2'>
                    {
                        !user && (
                            <div className='flex items-center gap-2'>
                                <Link to='/login' className='btn'>Login</Link>
                                <Link to='/register' className='btn'>Signup</Link>
                            </div>
                        )
                    }
                    {user && user.role === "student" && (
                        <Link to="/student/dashboard" className="btn btn-outline">
                            Student Dashboard
                        </Link>
                    )}

                    {user && user.role === "instructor" && (
                        <Link to="/instructor/dashboard" className="btn btn-outline">
                            Instructor Dashboard
                        </Link>
                    )}

                    {user && user.role === "admin" && (
                        <Link to="/admin-dashboard" className="btn btn-outline">
                            Admin Dashboard
                        </Link>
                    )}

                    {
                        user && <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className='text-xl font-bold'>{user?.name}</a>
                                </li>
                                <li><a onClick={handleLogout}>Logout</a></li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar