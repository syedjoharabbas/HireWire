using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HireWire.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddJobOwner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "OwnerUsername",
                table: "Jobs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "OwnerUsername",
                table: "Jobs");
        }
    }
}
