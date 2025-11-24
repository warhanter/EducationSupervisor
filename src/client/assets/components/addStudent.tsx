import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, User, School } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import HeaderNavbar from "./HeaderNavbar";
import { useStudents } from "@/client/providers/StudentProvider";
import _ from "lodash";

const studentSchema = z.object({
  first_name: z.string().min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),
  last_name: z.string().min(2, "اللقب يجب أن يحتوي على حرفين على الأقل"),
  student_dob: z.string().min(1, "تاريخ الميلاد مطلوب"),
  student_pob: z.string().min(2, "مكان الميلاد مطلوب"),
  gender: z.enum(["ذكر", "أنثى"], { message: "الجنس مطلوب" }),
  level: z.enum(["أولى", "ثانية", "ثالثة"], {
    message: "المستوى الدراسي مطلوب",
  }),

  class_name: z.string().min(1, "اسم القسم مطلوب"),
  class_number: z.string().min(1, "رقم القسم مطلوب"),
  student_status: z.enum(["داخلي", "نصف داخلي", "خارجي"], {
    message: "الصفة مطلوبة",
  }),
  fathers_name: z.string().min(2, "اسم الأب مطلوب"),
  student_address: z.string().min(5, "العنوان مطلوب"),
  i3ada: z.boolean(),
  idmaj: z.boolean(),
  is_mamnouh: z.boolean(),
  is_new: z.boolean(),
});

const StudentForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    student_dob: "",
    student_pob: "",
    gender: "",
    level: "",
    class_name: "",
    class_number: "",
    student_status: "",
    fathers_name: "",
    student_address: "",
    i3ada: false,
    idmaj: false,
    is_mamnouh: false,
    is_new: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { classrooms } = useStudents();

  const divisions = useMemo(
    () =>
      _.uniqBy(
        classrooms.filter(
          (classroom) => classroom.class_level === formData.level
        ),
        "class_name"
      ),
    [formData.level, classrooms]
  );
  const class_numbers = useMemo(
    () =>
      _.sortBy(
        classrooms.filter(
          (classroom) =>
            classroom.class_level === formData.level &&
            classroom.class_name === formData.class_name
        ),
        "class_number"
      ),
    [classrooms, formData.class_name]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const result = studentSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      if (fieldErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name][0] || fieldErrors[name],
        }));
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitStatus(null);

    const result = studentSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const formattedErrors = {};

      Object.keys(fieldErrors).forEach((key) => {
        formattedErrors[key] = Array.isArray(fieldErrors[key])
          ? fieldErrors[key][0]
          : fieldErrors[key];
      });

      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const validatedData = result.data;

      // Prepare data for insertion
      const studentData = {
        ...validatedData,
        student_inscription_date: new Date().toISOString(),
        full_name: `${validatedData.last_name} ${validatedData.first_name}`,
        full_class_name: `${validatedData.level} ${validatedData.class_name} ${validatedData.class_number}`,
      };

      const { data, error } = await supabase
        .from("students")
        .insert([studentData]);

      if (error) {
        throw new Error(error.message);
      }

      setSubmitStatus({
        type: "success",
        message: `تم تسجيل التلميذ ${studentData.full_name} بنجاح!`,
      });

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        student_dob: "",
        student_pob: "",
        gender: "",
        level: "",
        class_name: "",
        class_number: "",
        student_status: "",
        fathers_name: "",
        student_address: "",
        i3ada: false,
        idmaj: false,
        is_mamnouh: false,
        is_new: true,
      });
      setErrors({});
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.message ||
          "فشل تسجيل التلميذ، تحقق من البيانات وحاول مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col" dir="rtl">
      <HeaderNavbar />
      <div className="bg-white border border-gray-200 m-8 max-sm:mx-0 max-sm:my-4 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
        <div className="bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r bg-slate-800 text-white">
            <div className="flex justify-center items-center  p-6">
              <h1 className="text-2xl md:text-3xl text-center font-bold">
                تسجيل تلميذ
              </h1>
            </div>
          </div>

          <div className="p-8">
            {submitStatus && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium">
                  {submitStatus.message}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  المعلومات الشخصية
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.first_name
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="الاسم"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اللقب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.last_name
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="اللقب"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.last_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الازدياد <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="student_dob"
                      value={formData.student_dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.student_dob
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.student_dob && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.student_dob}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      مكان الميلاد <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="student_pob"
                      value={formData.student_pob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.student_pob
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="مكان الميلاد"
                    />
                    {errors.student_pob && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.student_pob}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الجنس <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-white px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.gender
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">اختر الجنس</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم الأب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fathers_name"
                      value={formData.fathers_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.fathers_name
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="اسم الأب"
                    />
                    {errors.fathers_name && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fathers_name}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-5">
                    العنوان <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="student_address"
                    value={formData.student_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="2"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none ${
                      errors.student_address
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Student's full address"
                  />
                  {errors.student_address && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.student_address}
                    </p>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-600" />
                  المعلومات الأكاديمية
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المستوى <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-white px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.level
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">اختر المستوى</option>
                      <option value="أولى">أولى</option>
                      <option value="ثانية">ثانية</option>
                      <option value="ثالثة">ثالثة</option>
                    </select>
                    {errors.level && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.level}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الشعبة <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="class_name"
                      value={formData.class_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-white px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.class_name
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">اختر المستوى</option>
                      {divisions.map((division) => (
                        <option value={division.class_name}>
                          {division.class_name}
                        </option>
                      ))}
                    </select>
                    {errors.class_name && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.class_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الفوج <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="class_number"
                      value={formData.class_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-white px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        errors.class_number
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">اختر المستوى</option>
                      {class_numbers.map((division) => (
                        <option value={division.class_number}>
                          {division.class_number}
                        </option>
                      ))}
                    </select>
                    {errors.class_number && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.class_number}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الصفة
                  </label>

                  <select
                    name="student_status"
                    value={formData.student_status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-white px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                      errors.gender
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">اختر الصفة</option>
                    <option value="داخلي">داخلي</option>
                    <option value="نصف داخلي">نصف داخلي</option>
                    <option value="خارجي">خارجي</option>
                  </select>
                </div>
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    الحالة
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_new"
                        checked={formData.is_new}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">تلميذ جديد</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="i3ada"
                        checked={formData.i3ada}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">الإعادة</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="idmaj"
                        checked={formData.idmaj}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">إدماج</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_mamnouh"
                        checked={formData.is_mamnouh}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">ممنوح</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Checkboxes */}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  تسجيل التلميذ...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  حفظ
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
