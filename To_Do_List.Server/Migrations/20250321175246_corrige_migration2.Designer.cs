﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using To_Do_List.Server.Data;

#nullable disable

namespace To_Do_List.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250321175246_corrige_migration2")]
    partial class corrige_migration2
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("To_Do_List.Server.Models.Tarefas", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DataConclusao")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("DataCriacao")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Descricao")
                        .HasColumnType("text");

                    b.Property<int>("FkIdUsuario")
                        .HasColumnType("integer");

                    b.Property<char>("Status")
                        .HasColumnType("character(1)");

                    b.Property<string>("Titulo")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("character varying(30)");

                    b.HasKey("Id");

                    b.HasIndex("FkIdUsuario");

                    b.ToTable("Tarefas");
                });

            modelBuilder.Entity("To_Do_List.Server.Models.Users", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("Ativo")
                        .HasColumnType("integer");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)");

                    b.Property<string>("Senha")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("character varying(30)");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Ativo = 2,
                            Email = "admin@admin.com",
                            Nome = "Admin",
                            Senha = "123"
                        });
                });

            modelBuilder.Entity("To_Do_List.Server.Models.Tarefas", b =>
                {
                    b.HasOne("To_Do_List.Server.Models.Users", "Users")
                        .WithMany()
                        .HasForeignKey("FkIdUsuario")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
