using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HireWire.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddJobCandidate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CandidateId",
                table: "Jobs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CandidateName",
                table: "Jobs",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CandidateId",
                table: "Jobs");

            migrationBuilder.DropColumn(
                name: "CandidateName",
                table: "Jobs");
        }
    }
}
