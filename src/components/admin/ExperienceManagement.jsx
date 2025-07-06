import React, { useState, useEffect } from 'react';
import { Experience } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Upload, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExperienceManagement() {
  const [experiences, setExperiences] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({
    name: '', name_en: '', slug: '', description: '', detailed_description: '',
    price_range: '', duration: '', location: '', image_url: '', character_image_url: '',
    transition_quote: '', category: '', highlights: []
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    const data = await Experience.list('-created_date');
    setExperiences(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await Experience.update(editingExp.id, formData);
      } else {
        await Experience.create(formData);
      }
      setIsDialogOpen(false);
      setEditingExp(null);
      resetForm();
      loadExperiences();
    } catch (error) {
      alert('שגיאה בשמירת החוויה');
    }
  };

  const handleEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      name: exp.name || '',
      name_en: exp.name_en || '',
      slug: exp.slug || '',
      description: exp.description || '',
      detailed_description: exp.detailed_description || '',
      price_range: exp.price_range || '',
      duration: exp.duration || '',
      location: exp.location || '',
      image_url: exp.image_url || '',
      character_image_url: exp.character_image_url || '',
      transition_quote: exp.transition_quote || '',
      category: exp.category || '',
      highlights: exp.highlights || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('האם אתה בטוח שברצונך למחוק חוויה זו?')) {
      await Experience.delete(id);
      loadExperiences();
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const result = await UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: result.file_url }));
    } catch (error) {
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', name_en: '', slug: '', description: '', detailed_description: '',
      price_range: '', duration: '', location: '', image_url: '', character_image_url: '',
      transition_quote: '', category: '', highlights: []
    });
  };

  const addNewExperience = () => {
    setEditingExp(null);
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ניהול חוויות</h2>
        <Button onClick={addNewExperience} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          הוסף חוויה חדשה
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <Card key={exp.id} className="overflow-hidden">
            <CardHeader className="p-0">
              {exp.image_url && (
                <img src={exp.image_url} alt={exp.name} className="w-full h-48 object-cover" />
              )}
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{exp.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{exp.description}</p>
              <div className="flex gap-2 mb-3">
                <Badge>{exp.price_range}</Badge>
                {exp.category && <Badge variant="outline">{exp.category}</Badge>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(exp)} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  ערוך
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(exp.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingExp ? 'עריכת חוויה' : 'הוספת חוויה חדשה'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">שם החוויה (עברית)</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">שם החוויה (אנגלית)</label>
                <Input
                  value={formData.name_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">מזהה ייחודי (slug)</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">טווח מחירים</label>
                <Select value={formData.price_range} onValueChange={(value) => setFormData(prev => ({ ...prev, price_range: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר טווח מחירים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="עד 1,000 ₪">עד 1,000 ₪</SelectItem>
                    <SelectItem value="עד 2,000 ₪">עד 2,000 ₪</SelectItem>
                    <SelectItem value="עד 5,000 ₪">עד 5,000 ₪</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">תיאור קצר</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">תיאור מפורט</label>
              <Textarea
                value={formData.detailed_description}
                onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">משך זמן</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="למשל: 3-5 ימים"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">מיקום</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="למשל: אירופה"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ציטוט למעבר</label>
              <Input
                value={formData.transition_quote}
                onChange={(e) => setFormData(prev => ({ ...prev, transition_quote: e.target.value }))}
                placeholder="ציטוט שיוצג במעבר לחוויה"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">תמונה ראשית</label>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url')} disabled={uploading} />
                  {formData.image_url && (
                    <img src={formData.image_url} alt="תצוגה מקדימה" className="w-full h-32 object-cover rounded" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">תמונת דמות</label>
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'character_image_url')} disabled={uploading} />
                  {formData.character_image_url && (
                    <img src={formData.character_image_url} alt="תצוגה מקדימה" className="w-full h-32 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={uploading} className="flex-1">
                {uploading ? 'מעלה...' : editingExp ? 'עדכן חוויה' : 'הוסף חוויה'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                ביטול
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}