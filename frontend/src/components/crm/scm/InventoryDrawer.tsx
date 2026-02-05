import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Drawer } from '../../ui/Drawer';
import { createInventoryItem, updateInventoryItem } from '../../../api/inventory';

interface InventoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item?: any; // If provided, we are in edit mode
}

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({
  isOpen,
  onClose,
  onSuccess,
  item
}) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (item) {
      setValue('itemName', item.itemName);
      setValue('sku', item.sku);
      setValue('quantity', item.quantity);
      setValue('category', item.category);
      setValue('location', item.location);
      setValue('status', item.status);
    } else {
      reset({
        itemName: '',
        sku: '',
        quantity: 0,
        category: '',
        location: '',
        status: 'Available'
      });
    }
  }, [item, isOpen, setValue, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (item) {
        await updateInventoryItem(item.id, { ...data, quantity: Number(data.quantity) });
      } else {
        await createInventoryItem({ ...data, quantity: Number(data.quantity) });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save inventory item', error);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={item ? 'Edit Inventory Item' : 'Add Inventory Item'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Item Name *
          </label>
          <input
            {...register('itemName', { required: 'Item name is required' })}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="e.g. Server Rack 42U"
          />
          {errors.itemName && (
            <p className="mt-1 text-sm text-red-500">{errors.itemName.message as string}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SKU
            </label>
            <input
              {...register('sku')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g. SR-42U-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              {...register('quantity', { required: 'Quantity is required', min: 0 })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Select Category</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Networking">Networking</option>
              <option value="Cabling">Cabling</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            {...register('location')}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="e.g. Warehouse A, Shelf 3"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
          </button>
        </div>
      </form>
    </Drawer>
  );
};
