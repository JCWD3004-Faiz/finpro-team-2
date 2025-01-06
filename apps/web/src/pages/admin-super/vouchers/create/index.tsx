import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import SuperSidebar from '@/components/SuperSidebar';
import LoadingVignette from '@/components/LoadingVignette';
import SuccessModal from '@/components/modal-success';
import { showSuccess, hideSuccess } from "@/redux/slices/successSlice";
import ErrorModal from '@/components/modal-error';
import { showError, hideError } from "@/redux/slices/errorSlice";
import { createVoucher } from '@/redux/slices/manageVoucherSlice';

function CreateVoucher() {
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);
  const { isSuccessOpen, successMessage } = useSelector((state: RootState) => state.success);
  const { isErrorOpen, errorMessage } = useSelector((state: RootState) => state.error);
  const { loading } = useSelector((state: RootState) => state.manageVoucher);

  const [voucherType, setVoucherType] = useState('');
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [expirePeriod, setExpirePeriod] = useState<number>(0);
  const [minPurchase, setMinPurchase] = useState<number | undefined>(undefined);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newVoucherData = {
      voucher_type: voucherType,
      discount_type: discountType,
      discount_amount: discountAmount,
      expire_period: expirePeriod,
      min_purchase: minPurchase,
      max_discount: maxDiscount,
      description,
    };
    try {
        console.log("submitted voucher data: ",newVoucherData)
      await dispatch(createVoucher(newVoucherData)).unwrap();
      dispatch(showSuccess("Voucher successfully created"));
    } catch (error: any) {
      dispatch(showError("Failed to create voucher"));
    }
  }

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={() => dispatch({ type: 'superAdmin/toggleSidebar' })} />
      {loading && <LoadingVignette />}
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => dispatch(hideError())}
        errorMessage={errorMessage}
      />
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          dispatch(hideSuccess());
          window.location.href = '/admin-super/vouchers';
        }}
        successMessage={successMessage}
      />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6`}>
        <h1 className="text-4xl font-semibold text-center text-gray-900 mb-10 tracking-wide">Create Voucher</h1>
        <form onSubmit={handleSubmit} className="max-w-screen-md mx-auto bg-white p-6 rounded-md shadow-xl">
          <div className='grid md:grid-cols-2 gap-y-3'>
            <div className="md:ml-4 mt-4">
              <label htmlFor="description" className="block text-gray-700">Voucher Description</label>
              <textarea
                id="description"
                className="w-72 p-2 mt-2 border border-gray-300 rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>

            <div className="md:ml-4 mt-4">
              <label htmlFor="discountAmount" className="block text-gray-700">Discount Amount</label>
              <div className="flex items-center">
                {discountType === "NOMINAL" && <span className="text-gray-700 mr-2">Rp.</span>}
                <input
                  type="number"
                  id="discountAmount"
                  className="p-2 mt-2 border border-gray-300 rounded-md"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  required
                />
                {discountType === "PERCENTAGE" && <span className="text-gray-700 ml-2">%</span>}
              </div>
            </div>

            <div className="md:ml-4 mt-4">
              <label htmlFor="voucherType" className="block text-gray-700">Voucher Type</label>
              <select
                id="voucherType"
                className="p-2 mt-2 border border-gray-300 rounded-md"
                value={voucherType}
                onChange={(e) => setVoucherType(e.target.value)}
              >
                <option value="">Select voucher type</option>
                <option value="PRODUCT_DISCOUNT">Product</option>
                <option value="CART_DISCOUNT">Cart</option>
                <option value="SHIPPING_DISCOUNT">Shipping</option>
              </select>
            </div>

            <div className="md:ml-4 mt-4">
              <label htmlFor="discountType" className="block text-gray-700">Discount Type</label>
              <select
                id="discountType"
                className="p-2 mt-2 border border-gray-300 rounded-md"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="NOMINAL">Nominal</option>
              </select>
            </div>

            <div className="md:ml-4 mt-4">
              <label htmlFor="minPurchase" className="block text-gray-700">Minimum Purchase (Optional)</label>
              Rp. <input
                type="number"
                id="minPurchase"
                className="w-64 p-2 mt-2 border border-gray-300 rounded-md"
                value={minPurchase || ''}
                onChange={(e) => setMinPurchase(Number(e.target.value))}
              />
            </div>

            <div className="md:ml-4 mt-4">
              <label htmlFor="maxDiscount" className="block text-gray-700">Maximum Discount (Optional)</label>
              Rp. <input
                type="number"
                id="maxDiscount"
                className="w-64 p-2 mt-2 border border-gray-300 rounded-md"
                value={maxDiscount || ''}
                onChange={(e) => setMaxDiscount(Number(e.target.value))}
              />
            </div>

            <div className="md:ml-4 mt-4">
              <label htmlFor="expirePeriod" className="block text-gray-700">Expire Period (Months)</label>
              <input
                type="number"
                id="expirePeriod"
                className="p-2 mt-2 border border-gray-300 rounded-md"
                value={expirePeriod}
                onChange={(e) => setExpirePeriod(Number(e.target.value))}
                required
              />
            </div>

          </div>
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="bg-white text-indigo-600 font-semibold border-2 border-indigo-600 py-3 px-20 rounded-full hover:bg-indigo-600 hover:text-white transition-colors transform"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateVoucher;
