import { create } from "zustand";

function storeModalDelete () {
    return {
        modalOpen: false,
        deleteId: ""
    }
}

function storeModalForm () {
    return {
        modalOpen: false,
        id:"",
        isEdit: false,
    }
}

const useStoreModalDelete = create(storeModalDelete);
const useStoreModalForm = create(storeModalForm);

export {
    useStoreModalDelete,
    useStoreModalForm
}