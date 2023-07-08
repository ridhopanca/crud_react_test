import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';

//MRT Imports
//import MaterialReactTable from 'material-react-table'; //default import deprecated
import { MaterialReactTable } from 'material-react-table';
import { BsTrash, BsPencilSquare} from "react-icons/bs"

//Material UI Imports
import { Box, Button } from '@mui/material';
import { JsonDelete, JsonList } from "../../../api"
import { globalStorage, handleErrorFromApi, numberWithCommas } from '../../../helpers';
import { useStoreModalDelete, useStoreModalForm } from '../../../state';
import { ConfirmDelete } from "../../../components"
import { toast } from 'react-hot-toast';
import FormInput from './form';


export default function DataTable() {
    //data and fetching state
    const tableRef =  useRef(null)
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const { modalOpen, deleteId } = useStoreModalDelete();

    //table state
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    
    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Actions',
                Cell: ({ row }) => {
                    return (
                        <div className='flex gap-2'>
                            <button type="button" onClick={() => useStoreModalForm.setState({ modalOpen: true, id: btoa(JSON.stringify({id:row.original.id})), isEdit: true })}>
                                <BsPencilSquare size={18} className="text-yellow-500" />
                            </button>
                            <button type="button" onClick={() => handleRemove(row.original.id)}>
                                <BsTrash size={18} className="text-red-500" />
                            </button>
                        </div>
                    )
                },
                size: 100
            },
            {
            accessorFn: (row) => row.name, //accessorFn used to join multiple data into a single cell
            id: 'name', //id is still required when using accessorFn instead of accessorKey
            header: 'Name',
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
                <div
                className="flex items-center gap-4"
                >
                <img
                    alt="images"
                    height={40}
                    width={40}
                    src={row.original.images}
                    loading="lazy"
                    style={{ borderRadius: '5%' }}
                />
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <span>{renderedCellValue}</span>
                </div>
            ),
            },
            {
                accessorFn: (row) => numberWithCommas(row?.sell_price),
                id:"sell_price",
                header: 'Sell Price',
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue}</span>
                ),
                size:150
            },
            {
                accessorFn: (row) => numberWithCommas(row?.buy_price),
                id: 'buy_price',
                header: 'Buy Price',
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue}</span>
                ),
                size: 150
            },
            {
                accessorFn: (row) => row.quantity,
                id: 'quantity',
                header: 'Quantity',
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue}</span>
                ),
                size: 140
            },
        ],
        [],
    );

    const fetchData = useCallback( async () => {
        setIsLoading(true);
        setIsRefetching(true);
        try {
            let url = '/api/item/list';
            let token = globalStorage.getItem('crud_user_data').token;
            let page = parseInt(pagination.pageIndex) + 1;
            let params = {};
            params.limit = pagination.pageSize;
            params.search = globalFilter;
            if(sorting){
                params.sorting = sorting[0];
            }
            const response = await JsonList({ url, param:params, token, page });
            setData(response.response_data?.data ?? []);
            setRowCount(response.response_data?.total ?? 0);
        } catch(error){
            setIsError(true);
            console.error(error);
            setIsLoading(false);
            setIsRefetching(false);
            return;
        }
        setIsError(false);
        setIsLoading(false);
        setIsRefetching(false);
    }, [
        globalFilter,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        setData,
        setIsError,
        setIsLoading,
        setIsRefetching
    ])

    const onDelete = useCallback(() => {
        setIsLoading(true);
        let url = `/api/item/delete`
        let token = globalStorage.getItem('crud_user_data').token;
        let param = {}
        param.id = deleteId
        JsonDelete({ url, param, token })
            .then((response) => {
                let checkError = handleErrorFromApi({ response, alert: true })
                if(checkError){
                    return false
                }
                let dataResponse = response
                let desc = dataResponse.response_desc
                toast.success(desc)
                tableRef.current.resetRowSelection()
            })
            .catch((error) => {
                console.log(error)
                toast.error('Something went wrong')
            })
            .finally(() => {
                setIsLoading(false)
                useStoreModalDelete.setState({ modalOpen: false, deleteId : '' })
                fetchData()
            })
    }, [deleteId, fetchData])

    const handleRemove = (data) => {
        useStoreModalDelete.setState({ modalOpen: true, deleteId: data });
    }

    useEffect(() => {
        if(globalFilter || pagination.pageIndex || pagination.pageSize || sorting)
            fetchData();
        else 
            fetchData();
    }, [
        globalFilter,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
    ])
    

    return (
        <>
            <MaterialReactTable
                tableInstanceRef={tableRef}
                columns={columns}
                data={data}
                enableRowSelection
                manualFiltering
                manualPagination
                manualSorting
                muiToolbarAlertBannerProps={
                    isError
                    ? {
                        color: 'error',
                        children: 'Error loading data',
                        }
                    : undefined
                }
                onGlobalFilterChange={setGlobalFilter}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                rowCount={rowCount}
                state={{
                    globalFilter,
                    isLoading,
                    pagination,
                    showAlertBanner: isError,
                    showProgressBars: isRefetching,
                    sorting,
                }}
                positionToolbarAlertBanner="top"
                renderTopToolbarCustomActions={({ table }) => {
                    let disabled = (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())
                    let rows = table.getSelectedRowModel().flatRows.map((row) => row.getValue('id'));
                    return (
                        <div className="flex gap-2">
                            <Button 
                                onClick={() => useStoreModalForm.setState({ modalOpen: true, isEdit: false, id:'' })}
                                variant="contained" 
                                disableElevation
                            >
                                <Box as="span" className="mt-0.75">Create</Box>
                            </Button>
                            <Button 
                                onClick={fetchData}
                                variant="contained" 
                                disableElevation
                                color='secondary'
                            >
                                <Box as="span" className="mt-0.75">Refresh</Box>
                            </Button>
                            <Button
                                color="error"
                                disabled={!disabled}
                                onClick={() => handleRemove(rows)}
                                variant="contained"
                                disableElevation
                            >
                                Delete
                            </Button>
                            
                        </div>
                    );
                }}
            />
            <FormInput fetchData={fetchData} />
            <ConfirmDelete 
                isOpen={modalOpen}
                onClose={() => useStoreModalDelete.setState({ modalOpen: false })}
                onDelete={onDelete}
                isLoading={isLoading}
            />
        </>
    );
};

