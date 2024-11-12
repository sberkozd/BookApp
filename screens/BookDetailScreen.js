import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const BookDetailScreen = ({ route }) => {
  const { book } = route.params;
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);

  useEffect(() => {
    fetchBorrowedBooksCount();
  }, []);

  const fetchBorrowedBooksCount = async () => {
    try {
      const booksCollection = collection(db, 'books');
      const booksSnapshot = await getDocs(booksCollection);
      const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const borrowedBooksList = booksList.filter(book => book.borrowed === true);
      setBorrowedBooksCount(borrowedBooksList.length);
    } catch (error) {
      console.error('Error fetching borrowed books count:', error);
    }
  };

  const borrowBook = async () => {
    if (borrowedBooksCount >= 3) {
      Alert.alert('Limit Reached!', 'You can not borrow more than three books at a time.');
      return;
    }

    try {
      const bookDoc = doc(db, 'books', book.id);
      await updateDoc(bookDoc, { borrowed: true });
      Alert.alert('Success', 'You have borrowed the book.');
      fetchBorrowedBooksCount();
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: book.imageUrl }} style={styles.image} resizeMode="contain" />
      <Text style={styles.bookName}>{book.name}</Text>
      <Text style={styles.authorName}>{book.author}</Text>
      <Text style={styles.rating}>Rating: {book.rating}</Text>
      <Text style={styles.summary}>{book.summary}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={borrowBook}>
          <Text style={styles.buttonText}>Borrow Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  bookName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  authorName: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  summary: {
    fontSize: 16,
    textAlign: 'center',
  },
  rating: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    width: '80%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookDetailScreen;