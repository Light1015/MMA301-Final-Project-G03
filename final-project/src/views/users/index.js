import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Platform } from 'react-native';
import ListView from './ListView';
import AddView from './AddView';
import UpdateView from './UpdateView';
import DeleteView from './DeleteView';
import DetailView from './DetailView';
import UserModel from '../../models/UserModel';

if (Platform.OS === 'web') {
  try {
    require('../../../styles/users.scss');
  } catch (e) {
    // ignore if sass not installed
  }
}

export default function UsersShell({ initialUsers, currentUser, onBack }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [mode, setMode] = useState('list'); // list | add | update | delete | detail
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!initialUsers) {
      refresh();
    }
  }, []);

  const refresh = async () => {
    const all = await UserModel.getAllUsers();
    setUsers(all);
  };

  const handleAdd = async (data) => {
    await UserModel.updateUser(data.email, data); // create or replace
    await refresh();
    setMode('list');
  };

  const handleUpdate = async (data) => {
    await UserModel.updateUser(data.email, data);
    await refresh();
    setMode('list');
  };

  const handleDisable = async (user) => {
    // Toggle status: available <-> unavailable
    const newStatus = user.status === 'available' ? 'unavailable' : 'available';
    await UserModel.updateUserStatus(user.email, newStatus);
    await refresh();
    setMode('list');
  };

  return (
    <View style={styles.container}>
      <ListView 
        users={users} 
        onEdit={(u) => { setSelected(u); setMode('update'); }} 
        onDelete={(u) => { setSelected(u); setMode('delete'); }} 
        onAdd={() => setMode('add')} 
        onView={(u) => { setSelected(u); setMode('detail'); }}
        onBack={onBack}
        currentUser={currentUser} 
      />

      <Modal visible={mode==='add'} animationType="slide" transparent>
        <View style={styles.modalOverlay}><AddView onCancel={() => setMode('list')} onCreate={handleAdd} /></View>
      </Modal>

      <Modal visible={mode==='update'} animationType="slide" transparent>
        <View style={styles.modalOverlay}><UpdateView user={selected} onCancel={() => setMode('list')} onSave={handleUpdate} /></View>
      </Modal>

      <Modal visible={mode==='delete'} animationType="slide" transparent>
        <View style={styles.modalOverlay}><DeleteView user={selected} onCancel={() => setMode('list')} onConfirm={handleDisable} /></View>
      </Modal>

      <Modal visible={mode==='detail'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <DetailView 
            user={selected} 
            onClose={() => setMode('list')} 
            onEdit={(u) => { setSelected(u); setMode('update'); }} 
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
});
