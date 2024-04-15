import { create } from "zustand";

type ModalType = "profile" | "createStore" | "confirmDelete";

type ModalData = {
  user?: {
    email: string;
    name: string;
    image: string;
  };
  confirmDelete?: () => void;
  headerDelete?: string,
  descriptionDelete?: string,
};

type ModalStore = {
  data: ModalData | null;
  isOpen: boolean;
  type: ModalType | null;
  open: (type: ModalType, data?: ModalData) => void;
  close: () => void;
};

const useModal = create<ModalStore>((set) => ({
  data: null,
  type: null,
  isOpen: false,
  close: () => set({ isOpen: false }),
  open: (type, data = {}) => set({ isOpen: true, type, data }),
}));

export default useModal;
