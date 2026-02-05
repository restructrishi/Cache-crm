import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Drawer } from '../../ui/Drawer';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { ordersApi } from '../../../api/orders';

interface CreateOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface OrderFormValues {
  poNumber: string;
  poDate: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  accountId: string; // Optional: Select existing vendor
  terms: string;
  notes: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export const CreateOrderDrawer: React.FC<CreateOrderDrawerProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrderFormValues>({
    defaultValues: {
      poNumber: '',
      poDate: new Date().toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const items = watch('items');
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);

  // Auto-calculate row total when qty/price changes
  const handleItemChange = (index: number, field: 'quantity' | 'unitPrice', value: number) => {
    const qty = field === 'quantity' ? value : items[index].quantity;
    const price = field === 'unitPrice' ? value : items[index].unitPrice;
    setValue(`items.${index}.totalPrice`, qty * price);
  };

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setLoading(true);
      await ordersApi.create({
        ...data,
        totalAmount
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating PO:', error);
      alert('Failed to create Purchase Order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create Purchase Order"
      width="w-[800px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
        
        {/* Vendor Details */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-blue-500" />
            Vendor Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor Name *</label>
              <input
                {...register('vendorName', { required: 'Vendor Name is required' })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                placeholder="Acme Corp"
              />
              {errors.vendorName && <p className="text-red-500 text-xs mt-1">{errors.vendorName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor Email</label>
              <input
                {...register('vendorEmail')}
                type="email"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                placeholder="contact@acme.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor Phone</label>
              <input
                {...register('vendorPhone')}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PO Date</label>
              <input
                {...register('poDate')}
                type="date"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="font-semibold text-gray-900 dark:text-white">Order Items</h3>
             <button
              type="button"
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 })}
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
             >
               <Plus className="w-4 h-4" /> Add Item
             </button>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
                <tr>
                  <th className="px-4 py-3 w-[40%]">Description</th>
                  <th className="px-4 py-3 w-[15%]">Qty</th>
                  <th className="px-4 py-3 w-[20%]">Unit Price</th>
                  <th className="px-4 py-3 w-[20%]">Total</th>
                  <th className="px-4 py-3 w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {fields.map((field, index) => (
                  <tr key={field.id} className="bg-white dark:bg-gray-800">
                    <td className="p-2">
                      <input
                        {...register(`items.${index}.description` as const, { required: true })}
                        className="w-full px-3 py-1.5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-transparent"
                        placeholder="Item name"
                      />
                    </td>
                    <td className="p-2">
                       <input
                        type="number"
                        {...register(`items.${index}.quantity` as const, { 
                          valueAsNumber: true,
                          onChange: (e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))
                        })}
                        className="w-full px-3 py-1.5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded focus:border-blue-500 bg-transparent"
                      />
                    </td>
                    <td className="p-2">
                       <input
                        type="number"
                        step="0.01"
                        {...register(`items.${index}.unitPrice` as const, { 
                          valueAsNumber: true,
                          onChange: (e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))
                        })}
                        className="w-full px-3 py-1.5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded focus:border-blue-500 bg-transparent"
                      />
                    </td>
                    <td className="p-2 text-right font-medium text-gray-900 dark:text-white">
                      ${watch(`items.${index}.totalPrice`)?.toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800/50 font-semibold">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right">Total Amount:</td>
                  <td className="px-4 py-3 text-right text-lg text-blue-600 dark:text-blue-400">
                    ${totalAmount.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Terms & Conditions</label>
              <textarea
                {...register('terms')}
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                placeholder="Payment terms, warranty, etc."
              />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                placeholder="Internal notes..."
              />
           </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create PO'}
          </button>
        </div>

      </form>
    </Drawer>
  );
};
