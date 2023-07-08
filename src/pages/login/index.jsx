import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { Input, Button, IconButton } from "../../components";
import Logo from "../../assets/img/logo.png";
import { JsonLogin } from "../../api";
import Cookies from "js-cookie";
import { globalStorage, handleErrorFromApi } from "../../helpers";

export default function LoginPage(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [typePass, setTypePass] = useState('password');
    const validationSchema = Yup.object().shape({
        email: Yup.string().email()
          .required('Email is required').label('Email'),
        password: Yup.string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters')
    });
    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm({
        defaultValues : {
            email: '',
            password: ''
        },
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = (data) => {
        setIsLoading(true);
        let url = `/api/login`
        JsonLogin({url, param:data})
            .then((response) => {
                setIsLoading(false)
                let checkError = handleErrorFromApi({ response, alert: true })
                if(checkError){
                    return false
                }
                const dataResponse = response;
                const tokens = dataResponse.response_data.token;
                const userData = dataResponse.response_data;
                const newUser = {...userData} 
                const expires = (tokens.expires_in || 30 * 60) * 1000
                const inOneHour = new Date(new Date().getTime() + expires)
                Cookies.set('crud_access_token', tokens, { expires: inOneHour })
                Cookies.set('crud_refresh_token', 'refresh_token')
                globalStorage.setItem('crud_user_data', JSON.stringify(newUser))
                navigate('/', { replace:true })
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
                toast.error('Something went wrong')
            })
    }

    const handleType = useCallback(() => {
        if(typePass === 'password'){
            setTypePass('text')
        } else {
            setTypePass('password')
        }
    }, [typePass, setTypePass])


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useMemo(() => { document.title = 'Crud Test | Login'}, [])
    return (
        <div className="grid content-center h-full min-h-screen bg-gray-100">
            <div className="py-5 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 md:rounded-xl">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-5 flex flex-col gap-2">
                        <img 
                            src={Logo} 
                            alt="Logo" 
                            height={70} 
                            width={70}
                            className="mx-auto"
                        />
                        <h2 className="text-blue-500 tracking-wider text-3xl text-center">Sign to your account</h2>
                        <p className="text-gray-600 text-normal leading-3 tracking-wide text-center">username: testing@gmail.com</p>
                        <p className="text-gray-600 text-normal leading-3 tracking-wide text-center">password: admin123</p>
                    </div>
                    <div className="max-w-md">
                        <form
                            className="space-y-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Input 
                                name="email" 
                                type="text" 
                                label="Email" 
                                register={register} 
                                errors={errors}
                                placeholder="example@gmail.com" 
                            />
                            <Input 
                                name="password" 
                                type={typePass} 
                                label="Password" 
                                register={register}
                                placeholder="********"
                                errors={errors} 
                                icon={() => typePass === 'password' ? (
                                    <IconButton 
                                        type="button"
                                        onClick={handleType}
                                        icon={() => <MdOutlineVisibility size={18} className="text-gray-700" /> }
                                        onMouseDown={handleMouseDownPassword}
                                    />
                                ) : (
                                    <IconButton 
                                        type="button"
                                        onClick={handleType}
                                        onMouseDown={handleMouseDownPassword}
                                        icon={() => <MdOutlineVisibilityOff size={18} className="text-gray-700" />}
                                    />
                            )}
                            />
                            <Button 
                                fullWidth
                                type="submit"
                                disabled={isLoading}
                            >
                                Sign In
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}