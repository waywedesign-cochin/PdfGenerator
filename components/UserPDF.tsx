// // components/UserPDF.tsx
// import { Document, Page, Text, StyleSheet, Font } from "@react-pdf/renderer";

// // Register a font (example using a .ttf file)
// Font.register({
//   family: "Roboto",
//   src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf", // Valid .ttf URL
// });

// // Define styles with the registered font
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontFamily: "Roboto", // Use the registered font
//   },
//   text: {
//     fontSize: 12,
//   },
// });

// interface UserPDFProps {
//   user: { name: string; email: string; [key: string]: any };
//   userId: string;
// }

// export const UserPDF = ({ user, userId }: UserPDFProps) => (
//   <Document>
//     <Page style={styles.page}>
//       <Text style={styles.text}>User ID: {userId}</Text>
//       <Text style={styles.text}>Name: {user.name}</Text>
//       <Text style={styles.text}>Email: {user.email}</Text>
//     </Page>
//   </Document>
// );
// components/UserPDF.tsx
import {
  Document,
  Page,
  Text,
  Image,
  StyleSheet,
  Font,
  View,
} from "@react-pdf/renderer";

// Register the font (unchanged, as it’s working)
Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf",
});
// Define enhanced styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    backgroundColor: "#f4f7fa", // Light blue-gray background
    flexDirection: "column",
  },
  header: {
    fontSize: 24,

    textAlign: "center",
    marginBottom: 20,
    color: "#2c3e50", // Dark blue-gray
    borderBottomWidth: 2,
    borderBottomColor: "#3498db", // Blue border
    paddingBottom: 10,
  },
  profileContainer: {
    flexDirection: "row",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff", // White background for section
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  secondContainer: {
    flexDirection: "column",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff", // White background for section
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40, // Circular image
    borderWidth: 2,
    borderColor: "#3498db",
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,

    color: "#2c3e50",
    marginBottom: 2,
  },
  text: {
    fontSize: 11,
    color: "#34495e",
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#7f8c8d",
  },
});

interface UserPDFProps {
  user: {
    name: string;
    email: string;
    username: string;
    address?: { street: string; city: string };
    phone: string;
    website: string;
    company?: { name: string };
    [key: string]: unknown;
  };
  userId: string;
}

export const UserPDF = ({ user, userId }: UserPDFProps) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>User Profile: {user.name}</Text>
      <View style={styles.profileContainer}>
        <Image style={styles.image} src="https://picsum.photos/150" />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.text}>{userId}</Text>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.text}>{user.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.text}>{user.email}</Text>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.text}>{user.username}</Text>
        </View>
      </View>
      <View style={styles.secondContainer}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.text}>
          {user.address?.street}, {user.address?.city}
        </Text>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.text}>{user.phone}</Text>
        <Text style={styles.label}>Website:</Text>
        <Text style={styles.text}>{user.website}</Text>
        <Text style={styles.label}>Company:</Text>
        <Text style={styles.text}>{user.company?.name}</Text>
      </View>
      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);
