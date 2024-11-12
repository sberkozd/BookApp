import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const storage = getStorage();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log('Fetching books from Firestore');
        const booksCollection = collection(db, 'books');
        const booksSnapshot = await getDocs(booksCollection);
        const booksList = await Promise.all(
          booksSnapshot.docs.map(async (doc) => {
            const bookData = doc.data();
            const imageUrl = await getDownloadURL(ref(storage, bookData.imageUrl));
            return { id: doc.id, ...bookData, imageUrl };
          })
        );
        console.log('Fetched books:', booksList);
        setBooks(booksList);
      } catch (error) {
        console.error('Error fetching books:', error); 
      }
    };

    fetchBooks();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('BookDetail', { book: item })}
    >
      <View style={styles.itemContent}>
        <Image source={{ uri: item.imageUrl }} style={styles.coverImage} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemAuthor}>{item.author}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#000" style={styles.arrowIcon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverImage: {
    width: 50,
    height: 75,
    marginRight: 16,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemAuthor: {
    fontSize: 14,
    color: '#555',
  },
  arrowIcon: {
    marginLeft: 10,
  },
});

export default BookListScreen;