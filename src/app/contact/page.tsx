'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success(t('contact.toastSuccess'));
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {t('contact.title')}
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Information Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{t('contact.phone')}</h3>
              <p className="text-xs text-gray-500 mt-1">{t('contact.phoneHours')}</p>
              <p className="text-sm font-semibold text-blue-600 mt-1.5">+855 (0) 23 888 999</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{t('contact.email')}</h3>
              <p className="text-xs text-gray-500 mt-1">{t('contact.emailResponse')}</p>
              <p className="text-sm font-semibold text-blue-600 mt-1.5">support@eshop-demo.com</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{t('contact.address')}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Preah Monivong Boulevard, Daun Penh, Phnom Penh, Cambodia
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{t('contact.hours')}</h3>
              <p className="text-xs text-gray-500 mt-1">{t('contact.hoursWeekday')}</p>
              <p className="text-xs text-gray-500">{t('contact.hoursSunday')}</p>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              {t('contact.sendMessage')}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              {t('contact.formDesc')}
            </p>

            {submitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-green-900 text-base">{t('contact.successTitle')}</h3>
                <p className="text-xs text-green-700 max-w-sm mx-auto">
                  {t('contact.successMsg')}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-green-800 underline hover:text-green-900"
                >
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      {t('contact.yourName')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      {t('contact.yourEmail')}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {t('contact.subject')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question about order delivery"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {t('contact.message')}
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe how we can assist you..."
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? t('contact.sending') : t('contact.send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
