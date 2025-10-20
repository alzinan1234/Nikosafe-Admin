// components/SettingsPage.js
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { settingsService } from '@/lib/settingsService';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const SettingsPage = ({ onBackClick }) => {
  const editor = useRef(null);
  const [activeTab, setActiveTab] = useState('privacy-security');
  const [editableContent, setEditableContent] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [tabContents, setTabContents] = useState({
    'privacy-security': { title: 'Privacy Policy', date: '', text: '', settingId: null },
    'terms-conditions': { title: 'Terms & Conditions', date: '', text: '', settingId: null },
    'about-us': { title: 'About Us', date: '', text: '', settingId: null },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Jodit editor configuration
  const joditConfig = useMemo(() => ({
    readonly: false,
    spellcheck: false,
    buttons: 'undo,redo,|,bold,italic,underline,strikethrough,|,ul,ol,|,link,cut,copy,paste,|,align,|,source',
    theme: 'dark',
    toolbarButtonSize: 'large',
  }), []);

  // Load all settings and FAQs on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🚀 Starting to load settings and FAQs...');

        // Load settings
        console.log('📍 Fetching settings...');
        const settingsResponse = await settingsService.getAllSettings();
        console.log('✅ Settings Response:', settingsResponse);

        if (settingsResponse.success && Array.isArray(settingsResponse.data)) {
          console.log('📊 Found settings:', settingsResponse.data.length);
          const settingsMap = {};
          const typeToTabMap = {
            'privacy_policy': 'privacy-security',
            'terms_conditions': 'terms-conditions',
            'about_us': 'about-us',
          };

          settingsResponse.data.forEach(setting => {
            console.log('Processing setting:', setting.setting_type, setting);
            const tabId = typeToTabMap[setting.setting_type];
            if (tabId) {
              settingsMap[tabId] = {
                ...tabContents[tabId],
                text: setting.content || '',
                date: setting.last_updated ? new Date(setting.last_updated).toLocaleString() : new Date().toLocaleString(),
                settingId: setting.id,
              };
            }
          });

          console.log('📝 Settings Map:', settingsMap);
          setTabContents(prev => ({ ...prev, ...settingsMap }));
        } else {
          console.warn('⚠️ No settings data or error:', settingsResponse);
          setError(settingsResponse.error || 'Failed to load settings');
        }

        // Load FAQs
        console.log('📍 Fetching FAQs...');
        const faqsResponse = await settingsService.getAllFaqs();
        console.log('✅ FAQs Response:', faqsResponse);

        if (faqsResponse.success && Array.isArray(faqsResponse.data)) {
          console.log('📊 Found FAQs:', faqsResponse.data.length);
          const sortedFaqs = faqsResponse.data.sort((a, b) => (a.order || 0) - (b.order || 0));
          setFaqs(sortedFaqs);
          if (sortedFaqs.length > 0) {
            console.log('🎯 Setting first FAQ as selected');
            setSelectedFaq(sortedFaqs[0]);
            setEditableContent(sortedFaqs[0].answer || '');
          }
        } else {
          console.warn('⚠️ No FAQs data or error:', faqsResponse);
        }

        console.log('✅ Data loading completed');
      } catch (error) {
        console.error('❌ Error loading data:', error);
        setError(error.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update editable content when tab or FAQ selection changes
  useEffect(() => {
    if (activeTab === 'faqs') {
      if (!selectedFaq && faqs.length > 0) {
        setSelectedFaq(faqs[0]);
        setEditableContent(faqs[0].answer || '');
      } else if (selectedFaq) {
        setEditableContent(selectedFaq.answer || '');
      }
    } else {
      setEditableContent(tabContents[activeTab]?.text || '');
    }
  }, [activeTab, selectedFaq, faqs, tabContents]);

  // Show alert dialog
  const showAlert = (message, type = 'success') => {
    const alertDialog = document.createElement('div');
    alertDialog.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
    alertDialog.innerHTML = `
      <div class="bg-[#343434] p-6 rounded-lg shadow-lg text-white max-w-sm">
        <p class="mb-4">${message}</p>
        <button id="alertOkBtn" class="w-full ${bgColor} hover:opacity-90 text-white py-2 px-4 rounded-[4px] font-medium">OK</button>
      </div>
    `;
    document.body.appendChild(alertDialog);
    document.getElementById('alertOkBtn').onclick = () => {
      document.body.removeChild(alertDialog);
    };
  };

  // Show confirmation dialog
  const showConfirmation = (message) => {
    return new Promise((resolve) => {
      const confirmDialog = document.createElement('div');
      confirmDialog.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
      confirmDialog.innerHTML = `
        <div class="bg-[#343434] p-6 rounded-lg shadow-lg text-white max-w-sm">
          <p class="mb-4">${message}</p>
          <div class="flex justify-end gap-2">
            <button id="confirmCancelBtn" class="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-[4px]">Cancel</button>
            <button id="confirmYesBtn" class="bg-cyan-400 hover:bg-cyan-300 text-white py-2 px-4 rounded-[4px]">Yes</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmDialog);
      document.getElementById('confirmYesBtn').onclick = () => {
        document.body.removeChild(confirmDialog);
        resolve(true);
      };
      document.getElementById('confirmCancelBtn').onclick = () => {
        document.body.removeChild(confirmDialog);
        resolve(false);
      };
    });
  };

  // Save settings (Privacy, Terms, About Us)
  const handleSaveSetting = async () => {
    setIsSaving(true);
    try {
      const typeMap = {
        'privacy-security': 'privacy_policy',
        'terms-conditions': 'terms_conditions',
        'about-us': 'about_us',
      };

      const settingType = typeMap[activeTab];
      const currentTab = tabContents[activeTab];

      let response;
      if (currentTab.settingId) {
        response = await settingsService.updateSetting(settingType, {
          content: editableContent,
        });
      } else {
        response = await settingsService.createSetting({
          setting_type: settingType,
          content: editableContent,
        });
      }

      if (response.success) {
        showAlert(`${currentTab.title} saved successfully!`);
        setTabContents(prev => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            text: editableContent,
            date: new Date().toLocaleString(),
            settingId: response.data.id || currentTab.settingId,
          },
        }));
      } else {
        showAlert(response.error || 'Failed to save setting', 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      showAlert('An error occurred while saving', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Save FAQ
  const handleSaveFaq = async () => {
    if (!selectedFaq) {
      showAlert('No FAQ selected', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const response = await settingsService.updateFaq(selectedFaq.id, {
        question: selectedFaq.question,
        answer: editableContent,
        is_active: selectedFaq.is_active !== undefined ? selectedFaq.is_active : true,
        order: selectedFaq.order || 0,
      });

      if (response.success) {
        showAlert('FAQ updated successfully!');
        setFaqs(prev =>
          prev.map(faq =>
            faq.id === selectedFaq.id
              ? { ...faq, question: selectedFaq.question, answer: editableContent }
              : faq
          )
        );
      } else {
        showAlert(response.error || 'Failed to update FAQ', 'error');
      }
    } catch (error) {
      console.error('FAQ save error:', error);
      showAlert('An error occurred while saving FAQ', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Add new FAQ
  const handleAddFaq = async () => {
    setIsSaving(true);
    try {
      const response = await settingsService.createFaq({
        question: 'New Question',
        answer: '<p>New Answer</p>',
        is_active: true,
        order: faqs.length,
      });

      if (response.success) {
        const newFaq = response.data;
        setFaqs(prev => [...prev, newFaq]);
        setSelectedFaq(newFaq);
        setEditableContent(newFaq.answer || '');
        showAlert('FAQ created successfully!');
      } else {
        showAlert(response.error || 'Failed to create FAQ', 'error');
      }
    } catch (error) {
      console.error('Add FAQ error:', error);
      showAlert('An error occurred while creating FAQ', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async () => {
    if (!selectedFaq) return;
    const confirmed = await showConfirmation(`Are you sure you want to delete "${selectedFaq.question}"?`);
    if (!confirmed) return;

    setIsSaving(true);
    try {
      const response = await settingsService.deleteFaq(selectedFaq.id);
      if (response.success) {
        showAlert('FAQ deleted successfully!');
        const newFaqs = faqs.filter(faq => faq.id !== selectedFaq.id);
        setFaqs(newFaqs);
        setSelectedFaq(newFaqs.length > 0 ? newFaqs[0] : null);
        setEditableContent('');
      } else {
        showAlert(response.error || 'Failed to delete FAQ', 'error');
      }
    } catch (error) {
      console.error('Delete FAQ error:', error);
      showAlert('An error occurred while deleting FAQ', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Update selected FAQ question
  const handleQuestionChange = (e) => {
    if (selectedFaq) {
      setSelectedFaq({ ...selectedFaq, question: e.target.value });
    }
  };

  // Select FAQ
  const handleFaqSelection = (faq) => {
    setSelectedFaq(faq);
    setEditableContent(faq.answer || '');
  };

  if (loading) {
    return (
      <div className="bg-[#343434] rounded-2xl min-h-screen text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Loading settings...</p>
          <p className="text-xs text-gray-400 mt-2">Check browser console for details</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#343434] rounded-2xl min-h-screen text-white p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">Error loading settings:</p>
          <p className="text-sm mb-4">{error}</p>
          <p className="text-xs text-gray-400">Check console (F12) for detailed error logs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#343434] rounded-2xl min-h-screen text-white p-6 sm:p-6 lg:p-8 font-inter">
      <div className="flex items-center mb-6">
        {onBackClick && (
          <button onClick={onBackClick} className="text-light-gray-text hover:text-white mr-4" aria-label="Go back">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
      </div>

      <div className="border-b border-gray-700">
        <div className="md:w-full flex justify-start bg-dark-bg rounded-t-lg overflow-x-auto scrollbar-hide">
          {['privacy-security', 'terms-conditions', 'about-us', 'faqs'].map((tabId) => {
            const tabTitle = tabId === 'faqs' ? 'FAQs' : tabContents[tabId]?.title;
            return (
              <button
                key={tabId}
                className={`flex-shrink-0 px-4 py-4 text-lg font-medium relative ${
                  activeTab === tabId ? 'text-[#00C1C9]' : 'text-light-gray-text hover:text-white'
                }`}
                onClick={() => setActiveTab(tabId)}
              >
                {tabTitle}
                {activeTab === tabId && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] -mb-[1px] bg-[#00C1C9]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-dark-bg p-4 rounded-b-lg -mt-px">
        {activeTab !== 'faqs' && (
          <>
            <h2 className="text-xl font-semibold mb-1">{tabContents[activeTab].title}</h2>
            <p className="text-sm text-light-gray-text mb-4">{tabContents[activeTab].date || 'Never saved'}</p>
            <div className="rounded-md mb-6 py-2">
              <JoditEditor
                className="jodit-custom-theme"
                ref={editor}
                value={editableContent}
                config={joditConfig}
                onChange={(newContent) => setEditableContent(newContent)}
              />
            </div>
          </>
        )}

        {activeTab === 'faqs' && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3 border-r border-gray-700 pr-4">
              <h3 className="text-lg font-semibold mb-3">Questions ({faqs.length})</h3>
              <button
                onClick={handleAddFaq}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 rounded-[4px] bg-lime-500 hover:bg-lime-400 disabled:bg-lime-600 text-white py-2 font-medium border-b-4 border-lime-600 mb-4"
              >
                <PlusIcon className="h-5 w-5" /> Add New Question
              </button>
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {faqs.map((faq) => (
                  <li key={faq.id} className="mb-2">
                    <button
                      className={`text-left w-full p-2 rounded-md text-sm transition-colors ${
                        selectedFaq && selectedFaq.id === faq.id
                          ? 'bg-gray-700 text-white'
                          : 'text-light-gray-text hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={() => handleFaqSelection(faq)}
                    >
                      {faq.question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-2/3">
              {selectedFaq ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-light-gray-text mb-1">Question:</label>
                    <input
                      type="text"
                      value={selectedFaq.question}
                      onChange={handleQuestionChange}
                      className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-[#00C1C9]"
                      placeholder="Enter question"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-light-gray-text mb-1">Answer:</label>
                    <JoditEditor
                      className="jodit-custom-theme"
                      ref={editor}
                      value={editableContent}
                      config={joditConfig}
                      onChange={(newContent) => setEditableContent(newContent)}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={handleDeleteFaq}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 rounded-[4px] bg-red-600 hover:bg-red-500 disabled:bg-red-700 text-white py-2 font-medium border-b-4 border-red-700"
                    >
                      <TrashIcon className="h-5 w-5" /> Delete FAQ
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-light-gray-text text-center py-8">Select an FAQ to edit or add a new one.</p>
              )}
            </div>
          </div>
        )}

        <div className="col-span-full mt-6">
          <button
            type="button"
            onClick={activeTab === 'faqs' ? handleSaveFaq : handleSaveSetting}
            disabled={isSaving}
            className="w-full mx-auto flex justify-center items-center rounded-[4px] bg-cyan-400 hover:bg-cyan-300 disabled:bg-cyan-500 text-white py-2 font-medium border-b-4 border-lime-400 transition-all"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save & Change'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;