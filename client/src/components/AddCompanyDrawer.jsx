import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from './ui/drawer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { addNewCompany } from '../api/recruiterApi';
import { BarLoader } from 'react-spinners';

const AddCompanyDrawer = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    industry: '',
    size: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const industries = [
    'Technology',
    'Healthcare',
    'Finance & Banking',
    'Education',
    'Manufacturing',
    'Retail & E-commerce',
    'Consulting',
    'Marketing & Advertising',
    'Real Estate',
    'Transportation & Logistics',
    'Entertainment & Media',
    'Non-Profit',
    'Government',
    'Energy & Utilities',
    'Food & Beverage',
    'Automotive',
    'Telecommunications',
    'Construction',
    'Pharmaceuticals',
    'Agriculture',
    'Tourism & Hospitality',
    'Legal Services',
    'Insurance',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1001-5000 employees',
    '5000+ employees'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      if (!formData.website.startsWith('http')) {
        setFormData(prev => ({ ...prev, website: `https://${prev.website}` }));
      }
    }

    if (formData.contactPhone && !/^[+]?[\d\s\-()]{10,}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setLoading(true);

      // Filter out empty fields to avoid sending unnecessary data
      const filteredData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value && value.trim() !== '') {
          acc[key] = value.trim();
        }
        return acc;
      }, {});

      await addNewCompany(filteredData);
      toast.success('Company profile created successfully!');
      onSuccess?.();
      onOpenChange(false);

      // Reset form
      setFormData({
        name: '',
        description: '',
        logo: '',
        website: '',
        industry: '',
        size: '',
        contactEmail: '',
        contactPhone: '',
        address: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error(error.response?.data?.message || 'Failed to create company profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <DrawerHeader className="shrink-0 border-b p-6">
          <DrawerTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-primary" />
            Create Company Profile
          </DrawerTitle>
          <DrawerDescription className="text-base">
            Create a comprehensive company profile to attract top talent and showcase your organization.
          </DrawerDescription>
          {loading && (
            <div className="mt-2">
              <BarLoader className="w-full" color="#36d7b7" height={3} />
            </div>
          )}
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <div className="py-6 space-y-8 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your company name"
                      className={errors.name ? 'border-destructive' : ''}
                      disabled={loading}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourcompany.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Company Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your company's mission, values, culture, and what makes you unique. This will be visible to potential candidates."
                    rows={4}
                    className="resize-none"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    A compelling description helps attract the right candidates
                  </p>
                </div>
              </div>

              {/* Company Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <h3 className="text-lg font-semibold text-foreground">Company Details</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleInputChange('industry', value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm font-medium">Company Size</Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value) => handleInputChange('size', value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">Company Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your company's full address including city, state, and country"
                    rows={3}
                    className="resize-none"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps candidates understand your location
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-sm font-medium">
                      Contact Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="hr@yourcompany.com"
                      className={errors.contactEmail ? 'border-destructive' : ''}
                      disabled={loading}
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-destructive">{errors.contactEmail}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Primary contact for job-related inquiries
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={errors.contactPhone ? 'border-destructive' : ''}
                      disabled={loading}
                    />
                    {errors.contactPhone && (
                      <p className="text-sm text-destructive">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Logo Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <h3 className="text-lg font-semibold text-foreground">Company Branding</h3>
                  <span className="text-xs text-muted-foreground">(Optional)</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-sm font-medium">Company Logo URL</Label>
                  <Input
                    id="logo"
                    type="url"
                    value={formData.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    placeholder="https://yourcompany.com/logo.png"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a direct URL to your company logo (optional - you can add this later)
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Fixed Footer with Submit Button */}
        <div className="shrink-0 border-t bg-background p-6 shadow-lg">
          <div className="flex gap-3 w-full">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Company...
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5 mr-2" />
                  Create Company Profile
                </>
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={loading} className="px-8 h-12 text-base" size="lg">
                Cancel
              </Button>
            </DrawerClose>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-3">
            Required fields are marked with <span className="text-destructive">*</span>
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;