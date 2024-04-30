import React, { useEffect, useState } from "react";
import Cards from "./Cards.jsx";
import styles from "../../styles/Lancamento.module.css";
import { IoSearchSharp } from "react-icons/io5";

export default function Lancamentos({ publisher }) {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [books, setBooks] = useState([]);
  const [count, setCount] = useState(12);

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  function search() {
    const newUrl = `busca?search=${searchValue}`;
    window.location.href = newUrl;
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    search();
  };

  const fetchData = async (queryparams) => {
    const query = new URLSearchParams(queryparams);
    const url = `${process.env.REACT_APP_API_URL}/book?` + query;
    console.log(url);
    const req = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await req.json();
    return data;
  };

  const handlePublisherChange = () => {
    console.log("limpando array de livros")
    setBooks([]); // Limpa o array de livros quando o editor muda
    setPage(1)
  };

  useEffect(() => {
    handlePublisherChange(); // Chama a função para limpar o array de livros quando o editor mudar
  }, [publisher]); // Define o editor como dependência

  useEffect(() => {
    (async () => {
      console.log("Trocou de página ou editor");
      if (publisher.unique && publisher?.data?.id) {
        console.log("Número da página para o fetch:",page)
        const data = await fetchData({
          publisherId: publisher?.data?.id,
          limit: "12",
          page: String(page),
          isHome: "false",
          active: "true",
        });
        setBooks((prevBooks) => [...prevBooks, ...data]);
        setCount(data?.length);
      } else {
        const data = await fetchData({
          limit: "12",
          page: String(page),
          isHome: "true",
          active: "true",
        });
        setBooks((prevBooks) => [...prevBooks, ...data]);
        setCount(data?.length);
      }
    })();
  }, [page, publisher]);

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Pesquise..."
          value={searchValue}
          onChange={handleSearch}
        />
        <button type="submit">
          <IoSearchSharp />
        </button>
      </form>
      <div className={styles.container_livros}>
        <div className="bookcontainer">
          {books && books.map((dado, i) => <Cards key={i} dado={dado} />)}
        </div>
        {count === 12 && (
          <button onClick={() => setPage(page + 1)} className={styles.showMore}>
            Mostrar mais
          </button>
        )}
      </div>
    </>
  );
}
