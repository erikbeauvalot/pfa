import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CategoryManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/categories', { name: categoryName, description: categoryDescription }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (response.status === 201) {
        setCategories([...categories, response.data]);
        setCategoryName('');
        setCategoryDescription('');
      } else {
        alert('Erreur lors de l\'ajout de la catégorie');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      alert('Erreur lors de l\'ajout de la catégorie');
    }
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

  const handleUpdateCategory = async (id: string, newName: string, newDescription: string) => {
    try {
      const categoryToUpdate = categories.find(category => category.id === id);
      if (categoryToUpdate) {
        await axios.put(`http://localhost:3001/api/categories/${id}`, { ...categoryToUpdate, name: newName, description: newDescription }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCategories(categories.map(category => category.id === id ? { ...category, name: newName, description: newDescription } : category));
      }
    } catch (error) {
      console.error('Handle Update : Erreur lors de la mise à jour de la catégorie:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestion des catégories</h2>
      <form onSubmit={handleAddCategory} autoComplete="off">
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
        <button type="submit" className="btn btn-primary">Ajouter la catégorie</button>
      </form>

      <h2 className="mt-5">Liste des catégories</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleUpdateCategory(category.id, prompt('Nouveau nom:', category.name) || category.name, prompt('Nouvelle description:', category.description) || category.description)}>Modifier</button>
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