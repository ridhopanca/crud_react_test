import { useForm, Controller } from "react-hook-form";
import { Input, Modal, Button } from "../../../components";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useStoreModalForm } from "../../../state";
import { useCallback, useEffect, useState } from "react";
import CurrencyText from "../../../components/input/currency";
import { FormDataCreateUpdate, JsonSearch } from "../../../api";
import { globalStorage, handleErrorFromApi } from "../../../helpers";
import { toast } from "react-hot-toast";

export default function FormInput({
    fetchData
}) {
    const [isLoading, setIsLoading] = useState(false)
    const { modalOpen, isEdit, id } = useStoreModalForm();
    const validationSchema = Yup.object().shape({
        name: Yup.string().required().label('Name'),
        sell_price: Yup.string().required().label('Sell Price'),
        buy_price: Yup.string().required().label('Buy Price'),
        quantity: Yup.string().required().label('Quantity'),
        image: Yup.mixed()
        .test({
            message: "Please provided supported file, only accept jpg or png",
            test: (file, context) => {
                if(isEdit){
                    if(file.length > 0){
                        const isValid = ['png','jpg', 'PNG', 'JPG'].includes(file?.[0].name.substr(file?.[0].name.lastIndexOf('.') + 1));
                        if(!isValid) context?.createError();
                        return isValid;
                    }
                    return true;
                } else {
                    if(file.length < 1) return false;
                    const isValid = ['png','jpg', 'PNG', 'JPG'].includes(file?.[0].name.substr(file?.[0].name.lastIndexOf('.') + 1));
                        if(!isValid) context?.createError();
                        return isValid;
                }
            }
        })
        .test({
            message: "File too big, maximum file size is 100kb",
            test: (file) => {
                if(isEdit){
                    if(file.length > 0){
                        const isValid = file?.[0].size < 100000
                        return isValid
                    }
                    return true;
                } else {
                    if(file.length < 1) return false;
                    const isValid = file?.[0].size < 100000
                    return isValid
                }
            }
        })
    });
    const {
        register,
        control,
        reset,
        handleSubmit,
        setValue,
        setError,
        formState: {
            errors
        }
    } = useForm({
        defaultValues : {
            name: '',
            sell_price: '',
            buy_price: '',
            quantity: ''
        },
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data) => {
        setIsLoading(true);
        let url; 
        let formData = new FormData();
        let token = globalStorage.getItem('crud_user_data').token;
        if(isEdit){
            url=`/api/item/update`;
            formData.append('id', JSON.parse(atob(id)).id)
        } else {
            url=`/api/item/save`;
        }
        if(data.image.length > 0){
            formData.append('image', data.image[0]);
        }
        formData.append('name', data.name)
        formData.append('sell_price', data.sell_price)
        formData.append('buy_price', data.buy_price)
        formData.append('quantity', data.quantity)
        // for (var pair of formData.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }
        
        FormDataCreateUpdate({url, formData, token})
            .then((response) => {
                setIsLoading(false);
                const errorResponse = handleErrorFromApi({ response, alert:true });
                if(errorResponse){
                    const responses = response.response_error;
                    if(responses?.name){
                        setError('name', {
                            type:'custom',
                            message: responses.name.toString()
                        })
                    }
                    return false;
                }
                let desc = response?.response_desc;
                toast.success(desc)
                useStoreModalForm.setState({ modalOpen: false })
                reset();
                fetchData();
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error)
                toast.error('Something went wrong');
            })
    }

    const fetchValue = useCallback(() => {
        let url = `/api/item/show/${id}`;
        let token = globalStorage.getItem('crud_user_data').token;
        JsonSearch({ url, token})
            .then((response) => {
                const errorResponse = handleErrorFromApi({ response, alert:true });
                if(errorResponse){
                    return false;
                }
                const data = response.response_data;
                setValue('sell_price', data.sell_price);
                setValue('buy_price', data.buy_price);
                setValue('name', data.name);
                setValue('quantity', data.quantity);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error)
                toast.error('Something went wrong');
            })
    }, [id])

    useEffect(() => {
        reset();
        if(isEdit){
            fetchValue();
        }
    }, [reset, fetchValue, isEdit])
    return (
        <Modal
            isOpen={modalOpen}
            onClose={() => useStoreModalForm.setState({ modalOpen: false})}
        >
            <h2 className="text-2xl mb-4 font-semibold">
                {isEdit ? "Edit" : "Create"} Form
            </h2>
            <form
                className="space-y-5"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input name="name" label="Name" register={register} errors={errors} placeholder="Items name" />
                <Controller 
                    name="sell_price"
                    control={control}
                    render={({field}) =>
                    <CurrencyText
                        {...field}
                        label="Sell Price"
                        maxLength="50"
                        placeholder='10,000.00'
                        errors={errors}
                        thousandSeparator={true}
                    />
                    }
                />
                <Controller 
                    name="buy_price"
                    control={control}
                    render={({field}) =>
                        <CurrencyText
                            {...field}
                            label="Buy Price"
                            maxLength="50"
                            placeholder='10,000.00'
                            errors={errors}
                            thousandSeparator={true}
                        />
                    }
                />
                <Input name="quantity" type="number" label="Quantity" onBlur={0} register={register} errors={errors} placeholder="10" />
                <Input name="image" type="file" label="Upload Image" register={register} errors={errors} />
                <div className="flex items-center gap-5 flex-row-reverse">
                    <Button 
                        fullWidth
                        type="submit"
                        disabled={isLoading}
                    >
                        {isEdit ? "Update" : "Save"}
                    </Button>
                    <Button 
                        fullWidth
                        type="button"
                        outlined
                        onClick={() => useStoreModalForm.setState({ modalOpen: false })}
                        colorOutlined="text-blue-500 hover:text-white border border-blue-500"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    )
}