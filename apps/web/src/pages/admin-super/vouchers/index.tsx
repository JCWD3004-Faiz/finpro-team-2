import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import SuperSidebar from '@/components/SuperSidebar';
import SuccessModal from '@/components/modal-success';
import { showSuccess, hideSuccess } from "@/redux/slices/successSlice";
import { setCurrentPage } from '@/redux/slices/superAdminSlice';
import { setSortOrder } from '@/redux/slices/manageInventorySlice';
import LoadingVignette from '@/components/LoadingVignette';
import Pagination from '@/components/pagination';
import SearchField from '@/components/searchField';
import { fetchVouchers, setSortField, setVoucherType, setDiscountType, deleteVoucher, editVoucher, giftVoucher } from '@/redux/slices/manageVoucherSlice';
import { FaSort } from 'react-icons/fa';
import { FaGift } from 'react-icons/fa6';
import { MdDelete, MdSaveAs, MdEditSquare } from 'react-icons/md';
import useDebounce from '@/hooks/useDebounce';
import SelectFilter from '@/components/selectFilter';
import { GoPin } from 'react-icons/go';
import GiftVoucherModal from '@/components/gift-voucher';
import { Button } from '@/components/ui/button';
import { LucideTicketPlus } from 'lucide-react';

const ManageVouchers: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarOpen, currentPage} = useSelector((state: RootState) => state.superAdmin);
  const { isSuccessOpen, successMessage } = useSelector((state: RootState) => state.success);
  const { vouchers, sortField, totalPages, voucherType, discountType, loading } = useSelector((state: RootState) => state.manageVoucher);
  const { sortOrder } = useSelector((state: RootState) => state.manageInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [editingVoucher, setEditingVoucher] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchVouchers({ page: 1, sortField, sortOrder, search: debouncedQuery, voucherType, discountType }));
  }, [currentPage, sortField, sortOrder, debouncedQuery, dispatch]);

  const handleDeleteVoucher = (voucher_id: number) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) { dispatch(deleteVoucher(voucher_id)); }
  };

  const handlePageChange = (page: number) => { if (page > 0 && page <= totalPages) { dispatch(setCurrentPage(page))}};

  const handleSort = (field: string) => {
    const updatedSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    if (sortField === field) {
      dispatch(setSortOrder(updatedSortOrder));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder("asc"));
    }
    dispatch(fetchVouchers({ page: 1, sortField: field, sortOrder: updatedSortOrder, search: debouncedQuery, voucherType, discountType }));
  };

  const handleVoucherChange = (voucher: string) => {
    dispatch(setVoucherType(voucher));
    dispatch(fetchVouchers({ page: currentPage, sortField, sortOrder, search: debouncedQuery, voucherType: voucher, discountType }));
  };

  const voucherTypeOptions = [{ value: "PRODUCT_DISCOUNT", label: "Product" }, { value: "CART_DISCOUNT", label: "Cart" }, { value: "SHIPPING_DISCOUNT", label: "Shipping" }];
  const voucherTypeMap: { [key: string]: string } = { "PRODUCT_DISCOUNT": "Product", "CART_DISCOUNT": "Cart", "SHIPPING_DISCOUNT": "Shipping" };

  const handleDiscountChange = (discount: string) => {
    dispatch(setDiscountType(discount));
    dispatch(fetchVouchers({ page: currentPage, sortField, sortOrder, search: debouncedQuery, voucherType, discountType: discount }));
  };

  const discountTypeOptions = [{ value: "PERCENTAGE", label: "Percentage" }, { value: "NOMINAL", label: "Nominal" }];

  const formatDiscountType = (value: string) => { return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase()) };

  const handleEditClick = (voucher: any) => { setEditingVoucher({ ...voucher })};

  const handleSaveClick = async () => {
    if (editingVoucher) {
      const voucherData = {
        ...editingVoucher, discount_amount: parseFloat(editingVoucher.discount_amount),
        min_purchase: editingVoucher.min_purchase ? parseFloat(editingVoucher.min_purchase) : null,
        max_discount: editingVoucher.max_discount ? parseFloat(editingVoucher.max_discount) : null,
        expire_period: parseFloat(editingVoucher.expire_period),
      };
      try {
        await dispatch(editVoucher(voucherData));
        setEditingVoucher(null);
        dispatch(showSuccess("Voucher successfully edited"));
      } catch (error) {
        console.error('Error while saving voucher:', error);
      }
    }
  };

  const handleCancelEdit = () => {setEditingVoucher(null)};

  const editedRowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editedRowRef.current && !editedRowRef.current.contains(event.target as Node)) { handleCancelEdit()}
    };
    document.addEventListener('click', handleClickOutside);
    return () => { document.removeEventListener('click', handleClickOutside)};
  }, [editingVoucher]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    const { value } = e.target;
    const parsedValue = field === 'discount_amount' || field === 'min_purchase' || field === 'max_discount' || field === 'expire_period'
      ? parseFloat(value) : value;
    setEditingVoucher({ ...editingVoucher, [field]: parsedValue });
  };

  const sortedVouchers = vouchers.filter(voucher => [9, 11].includes(voucher.voucher_id));
  const otherVouchers = vouchers.filter(voucher => ![9, 11].includes(voucher.voucher_id));
  
  const finalVouchers = [
    ...sortedVouchers.filter(voucher => voucher.voucher_id === 9),
    ...sortedVouchers.filter(voucher => voucher.voucher_id === 11),
    ...otherVouchers
  ];

  const handleGiftButtonClick = (voucher: any) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGiftVoucher = async (email: string) => {
    if (email) {
      try {
        await dispatch(giftVoucher({ voucher_id: selectedVoucher.voucher_id, email }));
        dispatch(showSuccess(`Voucher successfully gifted to ${email}`));
        handleCloseModal();
      } catch (error) {
        dispatch(showSuccess("Failed to gift voucher"));
      }
    }
  };

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => dispatch({ type: 'superAdmin/toggleSidebar' })} />
      {loading && <LoadingVignette />}
      <SuccessModal isOpen={isSuccessOpen} onClose={() => { dispatch(hideSuccess()); window.location.reload(); }} successMessage={successMessage}/>
      <GiftVoucherModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onGiftVoucher={handleGiftVoucher}
      />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Voucher Management
        </h1>
        <div className="ml-1 mb-2">
          <Button size="default" onClick={() => router.push({ pathname: '/admin-super/vouchers/create' })}>
            <LucideTicketPlus/>
            Create New Voucher
          </Button>
        </div>
        <div className="mb-5 flex w-full items-center justify-between">
            <div className="flex-grow mr-3">
                <SearchField searchTerm={searchQuery} onSearchChange={setSearchQuery} className="w-full" placeholder="Search vouchers..."/>
            </div>
            <div className="flex items-center gap-3">
                <div>
                    <label className="text-sm font-semibold whitespace-nowrap">Voucher Type:</label>
                    <SelectFilter label="All" value={voucherType} options={voucherTypeOptions} onChange={handleVoucherChange} />
                </div>
                <div>
                    <label className="text-sm font-semibold whitespace-nowrap">Discount Type:</label>
                    <SelectFilter label="All" value={discountType} options={discountTypeOptions} onChange={handleDiscountChange} />
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-[10px] shadow-2xl rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white uppercase">
                <th className="py-4 text-center">Gift</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Voucher Type</th>
                <th className="p-4 text-left">Discount Type</th>
                <th onClick={() => handleSort('discount_amount')} className="p-4 text-left cursor-pointer">
                  <div className="flex items-center">
                    Discount Amount
                    <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </th>
                <th className="p-4 text-left">Minimum Purchase</th>
                <th className="p-4 text-left">Maximum Discount</th>
                <th onClick={() => handleSort('expire_period')} className="p-4 text-left cursor-pointer">
                  <div className="flex items-center">
                    Expiry Period
                    <FaSort className="ml-2 opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                </th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {finalVouchers.map((voucher, index) => {
                const isPinned = voucher.voucher_id === 9 || voucher.voucher_id === 11;
                const rowClass = isPinned ? "bg-yellow-100 hover:bg-yellow-50" : (index % 2 === 0 ? "bg-gray-50" : "bg-white");
                return (
                <tr key={voucher.voucher_id} ref={editingVoucher && editingVoucher.voucher_id === voucher.voucher_id ? editedRowRef : null}
                className={`${rowClass} border-b hover:bg-gray-100 transition-colors`}>
                  <td className="py-3 text-center whitespace-nowrap">
                    <button onClick={() => handleGiftButtonClick(voucher)} className="mx-2 p-2 text-gray-800 rounded-full hover:text-gray-600  transition-colors transform" title="Gift voucher">
                      <FaGift className="text-2xl" />
                    </button>
                  </td>
                  <td className="p-4 max-w-48" title={voucher.description}>
                    <div className="truncate">
                    {editingVoucher && editingVoucher.voucher_id === voucher.voucher_id ? (
                      <input type="text" value={editingVoucher.description} onChange={(e) => handleInputChange(e, 'description')}
                        className="p-2 w-full border border-gray-300 rounded"
                      /> ) : (
                      <>
                    {isPinned && <GoPin className="inline-block text-black-500 mr-2" />} {voucher.description}
                      </>
                    )}
                    </div>
                  </td>
                  <td className="p-4">
                    {editingVoucher && editingVoucher.voucher_id === voucher.voucher_id ?
                      <select value={editingVoucher.voucher_type} onChange={(e) => handleInputChange(e, 'voucher_type')} className="p-2 border border-gray-300 rounded">
                        {voucherTypeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                      : voucherTypeMap[voucher.voucher_type]}
                  </td>
                  <td className="p-4">
                    {editingVoucher && editingVoucher.voucher_id === voucher.voucher_id ?
                      <select value={editingVoucher.discount_type} onChange={(e) => handleInputChange(e, 'discount_type')} className="p-2 border border-gray-300 rounded">
                        {discountTypeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                      : formatDiscountType(voucher.discount_type)}
                  </td>
                  <td className="p-4">
                    {editingVoucher && editingVoucher.voucher_id === voucher.voucher_id ?
                      <input type="number" value={editingVoucher.discount_amount} onChange={(e) => handleInputChange(e, 'discount_amount')}
                        className="p-2 w-full border border-gray-300 rounded"
                      />
                      : voucher.discount_type === "PERCENTAGE" ? `${voucher.discount_amount}%` : `${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number(voucher.discount_amount))}`}
                  </td>
                  <td className="p-4">
                    {editingVoucher && editingVoucher.voucher_id === voucher.voucher_id ?
                      <input type="number" value={editingVoucher.min_purchase} onChange={(e) => handleInputChange(e, 'min_purchase')}
                        className="p-2 w-full border border-gray-300 rounded"
                      />
                      : voucher.min_purchase !== null ? `${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number(voucher.min_purchase))}` : "-"}
                  </td>
                  <td className="p-4">
                    {editingVoucher && editingVoucher.voucher_id === voucher.voucher_id ?
                      <input type="number" value={editingVoucher.max_discount} onChange={(e) => handleInputChange(e, 'max_discount')}
                        className="p-2 w-full border border-gray-300 rounded"
                      />
                      : voucher.max_discount !== null ? `${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number(voucher.max_discount))} Off` : "-"}
                  </td>
                  <td className="p-4">
                    {editingVoucher && editingVoucher.voucher_id === voucher.voucher_id ?
                      <input type="number" value={editingVoucher.expire_period} onChange={(e) => handleInputChange(e, 'expire_period')}
                        className="p-2 w-full border border-gray-300 rounded"
                      />
                      : `${voucher.expire_period} months`}
                  </td>
            <td className="py-3 px-2 text-center whitespace-nowrap">
              <button onClick={(e) => { e.stopPropagation(); handleEditClick(voucher)}}
              className={`mx-2 p-1 rounded-full transition-colors transform ${isPinned ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-600 hover:text-white'}`} 
              disabled={isPinned} title="Edit voucher">
                {editingVoucher && editingVoucher.voucher_id === voucher.voucher_id ? (
                    <MdSaveAs className="text-xl" onClick={handleSaveClick} />
                ) : (
                <MdEditSquare className="text-xl" />
                )}
              </button>
              <button
              onClick={(e) => { e.stopPropagation(); handleDeleteVoucher(voucher.voucher_id); }}
              className={`mx-2 p-1 rounded-full transition-colors transform ${isPinned ? 'text-gray-400' : 'text-rose-600 hover:bg-rose-600 hover:text-white'}`}
              disabled={isPinned} title="Delete voucher">
                <MdDelete className="text-xl" />
                </button>
            </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default ManageVouchers;
