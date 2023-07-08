import React, { useMemo } from "react";
import Cookies from "js-cookie";
import { globalStorage } from "../../helpers";
import { useNavigate } from "react-router-dom";
import waves from '../../assets/img/wave.svg';
import { GoSignOut} from "react-icons/go";
import DataTable from "./components/data";

export default function DashboardPage(){
    const navigate = useNavigate()
    const handleLogOut = () => {
        Cookies.remove('crud_access_token');
        globalStorage.removeItem('crud_user_data');
        Cookies.remove('crud_refresh_token');
        navigate('/login')
    }
    useMemo(() => { document.title = `Crud Test | Master` },[])
    return (
        <div className="grid min-h-screen px-40"
            style={{
                backgroundImage: `url(${waves})`,
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="flex flex-col relative">
                <div className="flex justify-between items-center min-h-[90px]">
                    <h2 className="text-white text-3xl font-sans font-semibold">
                        Test Crud - Ridho Panca Sakti
                    </h2>
                    <button onClick={handleLogOut} className="flex gap-2 items-center text-3xl text-white font-sans font-semibold">
                        <GoSignOut size={24} className="text-white" style={{ stroke: 1}} />
                        Sign Out
                    </button>
                </div>
                <div className="flex flex-col gap-5 mb-5">
                    <DataTable />
                </div>
            </div>
        </div>
    )
}