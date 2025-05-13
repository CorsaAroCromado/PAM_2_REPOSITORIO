import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  TextInput,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import * as SQLite from "expo-sqlite";

// Abrir o banco só uma vez
const db = SQLite.openDatabaseSync("PAM2");

const Banco = () => {
  const [nome, setNome] = useState("");
  const[nome_delete, setnome_delete] = useState("");
  const [nomeAntigo, setNomeAntigo] = useState("");
  const [nomeNovo, setNomeNovo] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    criarTabela();
  }, []);

  async function criarTabela() {
    try {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS TB_usuarios (
          id INTEGER PRIMARY KEY NOT NULL,
          Nome TEXT NOT NULL
        );
      `);
      console.log("Tabela criada");
    } catch (error) {
      console.error("Erro ao criar tabela:", error);
    }
  }

  async function inserir() {
    if (!nome.trim()) {
      Alert.alert("Erro", "Digite um nome válido para inserir.");
      return;
    }

    try {
      await db.runAsync("INSERT INTO TB_usuarios (Nome) VALUES (?)", [nome]);
      console.log("Usuário inserido");
      setNome("");
      exibir();
    } catch (error) {
      console.error("Erro ao inserir:", error);
    }
  }

  async function exibir() {
    try {
      const results = await db.getAllAsync("SELECT * FROM TB_usuarios");
      setUsuarios(results);
    } catch (error) {
      console.error("Erro ao exibir:", error);
    }
  }

 async function deletar() {
  if (!nome_delete.trim()) {
    Alert.alert("Erro", "Digite um nome válido para deletar.");
    return;
  }

  try {
    await db.runAsync("DELETE FROM TB_usuarios WHERE Nome = ?", [nome_delete]);
    console.log(`Usuário ${nome_delete} deletado`);
    setnome_delete("");
    exibir();
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
}


  async function atualizar() {
    if (!nomeAntigo.trim() || !nomeNovo.trim()) {
      Alert.alert("Erro", "Preencha os dois nomes para atualizar.");
      return;
    }

    try {
      await db.runAsync("UPDATE TB_usuarios SET Nome = ? WHERE Nome = ?", [
        nomeNovo,
        nomeAntigo,
      ]);
      console.log(`Usuário ${nomeAntigo} atualizado para ${nomeNovo}`);
      setNomeAntigo("");
      setNomeNovo("");
      exibir();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CRUD de Usuários</Text>


      <Text style={styles.subtitle}>Inserir Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <View style={styles.button}>
        <Button title="Inserir" color="#2980b9" onPress={inserir} />
      </View>

      <Text style={styles.subtitle}>Deletar Usuário</Text>
        <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome_delete}
        onChangeText={setnome_delete}
      />
      <View style={styles.button}>
        <Button title="Deletar pelo nome" color="#c0392b" onPress={deletar} />
      </View>

      <Text style={styles.subtitle}>Editar Nome</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome antigo"
        value={nomeAntigo}
        onChangeText={setNomeAntigo}
      />
      <TextInput
        style={styles.input}
        placeholder="Novo nome"
        value={nomeNovo}
        onChangeText={setNomeNovo}
      />
      <View style={styles.button}>
        <Button title="Editar" color="#f39c12" onPress={atualizar} />
      </View>




    <Text style={styles.subtitle}>Visualizar Usuário</Text>
      <View style={styles.button}>
        <Button title="Exibir Todos" color="#27ae60" onPress={exibir} />
      </View>

      <View style={styles.userList}>
        {usuarios.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.cardText}>ID: {user.id}</Text>
            <Text style={styles.cardText}>Nome: {user.Nome}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ecf0f1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 0,
    marginTop: 30,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 45,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
  },
  userList: {
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    color: "#2c3e50",
  },
});

export default Banco;
