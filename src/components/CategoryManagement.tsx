import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CategoryManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryColor, setCategoryColor] = useState('#000000'); // Default color
  const [isDefault, setIsDefault] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/categories', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, [user]);

  const handleAddOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategoryId) {
      // Update category
      try {
        console.log('name ', categoryName, ' color : ', categoryColor, ' ', isDefault);

        const response = await axios.put(`http://localhost:3001/api/categories/${editingCategoryId}`, { name: categoryName, description: categoryDescription, color: categoryColor, isDefault }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (response.status === 200) {
          setCategories(categories.map(category => category.id === editingCategoryId ? response.data : category));
          setCategoryName('');
          setCategoryDescription('');
          setCategoryColor('#000000'); // Reset to default color
          setIsDefault(false);
          setEditingCategoryId(null);
        } else {
          alert('Erreur lors de la mise à jour de la catégorie');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        alert('Erreur lors de la mise à jour de la catégorie');
      }
    } else {
      // Add category
      try {
        console.log('name ', categoryName, ' color : ', categoryColor, ' ', isDefault);

        const response = await axios.post('http://localhost:3001/api/categories', { name: categoryName, description: categoryDescription, color: categoryColor, isDefault }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (response.status === 201) {
          setCategories([...categories, response.data]);
          setCategoryName('');
          setCategoryDescription('');
          setCategoryColor('#000000'); // Reset to default color
          setIsDefault(false);
        } else {
          alert('Erreur lors de l\'ajout de la catégorie');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la catégorie:', error);
        alert('Erreur lors de l\'ajout de la catégorie');
      }
    }
  };

  const handleEditCategory = (category: any) => {
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setCategoryColor(category.color);
    setIsDefault(category.isDefault);
    setEditingCategoryId(category.id);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestion des catégories</h2>
      <form onSubmit={handleAddOrUpdateCategory} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">Nom de la catégorie</label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="categoryDescription" className="form-label">Description de la catégorie</label>
          <input
            type="text"
            className="form-control"
            id="categoryDescription"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="categoryColor" className="form-label">Couleur de la catégorie</label>
          <input
            type="color"
            className="form-control"
            id="categoryColor"
            value={categoryColor}
            onChange={(e) => setCategoryColor(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isDefault"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isDefault">Catégorie par défaut</label>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingCategoryId ? 'Modifier la catégorie' : 'Ajouter la catégorie'}
        </button>
      </form>

      <h2 className="mt-5">Liste des catégories</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Description</th>
            <th scope="col">Couleur</th>
            <th scope="col">Par défaut</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: category.color, width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #ccc' }}
                  disabled
                ></button>
              </td>
              <td>{category.isDefault ? 'Oui' : 'Non'}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditCategory(category)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(category.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;