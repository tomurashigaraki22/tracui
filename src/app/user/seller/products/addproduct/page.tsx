"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BiPlus, BiX } from "react-icons/bi";

// Define validation schema
const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  ownerEmail: z.string().email("Invalid email address"),
  thresholds: z.object({
    pressure: z.number().min(0, "Pressure must be positive"),
    humidity: z.number().min(0, "Humidity must be positive"),
    temperature: z
      .number()
      .min(-273, "Temperature cannot be below absolute zero"),
  }),
  deliveryLocation: z.string().min(1, "Delivery location is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

const AddProductPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log("Submitting product:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSuccess = () => {
    setSubmitSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-black rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded relative">
          <span className="block sm:inline">Product added successfully!</span>
          <button
            onClick={handleResetSuccess}
            className="absolute top-0 right-0 p-2"
          >
            <BiX className="h-5 w-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Name */}
        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Name
          </label>
          <input
            id="productName"
            type="text"
            {...register("productName")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] ${
              errors.productName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter product name"
          />
          {errors.productName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.productName.message}
            </p>
          )}
        </div>

        {/* Owner Email */}
        <div>
          <label
            htmlFor="ownerEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Owner Email
          </label>
          <input
            id="ownerEmail"
            type="email"
            {...register("ownerEmail")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] ${
              errors.ownerEmail ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter owner email"
          />
          {errors.ownerEmail && (
            <p className="mt-1 text-sm text-red-600">
              {errors.ownerEmail.message}
            </p>
          )}
        </div>

        {/* Thresholds Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Threshold Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pressure */}
            <div>
              <label
                htmlFor="pressure"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pressure (kPa)
              </label>
              <input
                id="pressure"
                type="number"
                step="0.01"
                {...register("thresholds.pressure", { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] ${
                  errors.thresholds?.pressure
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.thresholds?.pressure && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.thresholds.pressure.message}
                </p>
              )}
            </div>

            {/* Humidity */}
            <div>
              <label
                htmlFor="humidity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Humidity (%)
              </label>
              <input
                id="humidity"
                type="number"
                step="0.01"
                {...register("thresholds.humidity", { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] ${
                  errors.thresholds?.humidity
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.thresholds?.humidity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.thresholds.humidity.message}
                </p>
              )}
            </div>

            {/* Temperature */}
            <div>
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Temperature (°C)
              </label>
              <input
                id="temperature"
                type="number"
                step="0.01"
                {...register("thresholds.temperature", { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] ${
                  errors.thresholds?.temperature
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.thresholds?.temperature && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.thresholds.temperature.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Location */}
        <div>
          <label
            htmlFor="deliveryLocation"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Delivery Location
          </label>
          <input
            id="deliveryLocation"
            type="text"
            {...register("deliveryLocation")}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] ${
              errors.deliveryLocation ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter delivery address"
          />
          {errors.deliveryLocation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.deliveryLocation.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 text-black py-2 border border-transparent rounded-md font-bold cursor-pointer shadow-sm text-sm bg-[#00FFD1] hover:bg-[#77decb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <BiPlus className="inline mr-1" />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
