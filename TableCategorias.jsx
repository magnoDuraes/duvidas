import React, { useState, useEffect } from "react";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Icon,
  Pagination,
  Input,
  Segment,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Styles from "../../../styles/TableCategorias.module.css";
import ModalDelete from "../../Global.Components/ModalDelete";
import { ServicesModule } from "../../../services/services.module";
import ModalEdit from "../../Global.Components/ModalEdit";
import { useForm } from "react-hook-form";

export default function TableCategorias() {
  const [genders, setGenders] = useState([]);
  const [originalGenders, setOriginalGenders] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  

  const [editedName, setEditedName] = useState("");
  const [fields, setFields] = useState(null);
  
  const handleNameChange = (event) => {
    setEditedName(event.target.value);
  };

  useEffect(() => {
    if (editedName !== "") {
      setFields({ name: editedName });
    }
  }, [editedName]);

  const deleteCategory = async (id) => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/gender/${id}`;
    const response = await fetch(apiUrl, {
      method: "DELETE",
    });
    if (response.ok) {
      setGenders(genders.filter((g) => g.id !== id));
    } else {
      console.log("ERRO!");
    }
    setActiveModal(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await ServicesModule.public.getAll("gender");
        setGenders(data);
        setOriginalGenders(data);
        setLoading(false);
      } catch (err) {
        console.log("Erro ao obter dados do servidor");
      }
    })();
  }, []);



  const handleFormSubmit = async (source) => {
    const apiUrl = `${process.env.REACT_APP_API_URL}/gender/${source.id}`;
    const response = await fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify(source),
      headers: { "Content-Type": "application/json" },
    });

    console.log(response.ok);
  };

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(genders.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = genders.slice(startIndex, endIndex);

  const handlePageChange = (_, { activePage }) => {
    setActivePage(activePage);
  };

  const handleSearch = (value) => {
    if (value.trim() === "") {
      setGenders(originalGenders);
    } else {
      const filteredData = originalGenders.filter((g) =>
        g.name.toLowerCase().includes(value.toLowerCase())
      );
      setGenders(filteredData);
    }
  };

  return (
    <div className={Styles.container}>
      {loading === true ? (
        <Segment>
          <Dimmer active inverted>
            <Loader size="medium">Carregando...</Loader>
          </Dimmer>
        </Segment>
      ) : (
        <>
          <Input
            className={Styles.search}
            transparent
            icon={{ name: "search", link: true }}
            placeholder="Buscar categoria..."
            onChange={(_, { value }) => handleSearch(value)}
          />
          <Table striped>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Categoria</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentData.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>{e.name}</TableCell>
                  <TableCell className={Styles.icones}>
                    <ModalEdit
                      config={{
                        open: editModalOpen === i,
                        setOpen: () => setEditModalOpen(null),
                      }}
                      submitConfig={{
                        handleSubmit,
                        submitFunction: handleFormSubmit,
                      }}
                      trigger={
                        <FaPencilAlt
                          className={Styles.iconeLapis}
                          onClick={() => {
                            setEditModalOpen(i);
                            setValue("id", e.id);
                            setEditedName(e.name);
                          }}
                        />
                      }
                      header={`Edição da categoria ${e.name}`}
                      fields={[
                        {
                          label: "Nome",
                          component: (
                            <input
                              {...register("name")}
                              type="text"
                              value={editedName}
                              onChange={handleNameChange}
                            />
                          ),
                        },
                      ]}
                    />
                    <ModalDelete
                      data={{
                        header: "Remoção de Categoria",
                        content: () => (
                          <>
                            Você tem certeza que deseja remover a categoria{" "}
                            <b>{e.name}</b>?
                          </>
                        ),
                      }}
                      trigger={
                        <FaTrashAlt
                          className={Styles.iconeLixeira}
                          onClick={() => setActiveModal(i)}
                        />
                      }
                      buttons={[
                        {
                          type: "negative",
                          content: "Deletar",
                          onClick: () => deleteCategory(e.id),
                        },
                      ]}
                      open={activeModal === i}
                      setOpen={() => setActiveModal(null)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            activePage={activePage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            ellipsisItem={{
              content: <Icon name="ellipsis horizontal" />,
              icon: true,
            }}
            firstItem={{
              content: <Icon name="angle double left" />,
              icon: true,
            }}
            lastItem={{
              content: <Icon name="angle double right" />,
              icon: true,
            }}
            prevItem={{ content: <Icon name="angle left" />, icon: true }}
            nextItem={{ content: <Icon name="angle right" />, icon: true }}
          />
        </>
      )}
    </div>
  );
}
