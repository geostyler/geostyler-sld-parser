<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Simple Point Filter</se:Name>
    <UserStyle>
      <se:Name>Simple Point Filter</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Test</se:Name>
          <Filter xmlns="http://www.opengis.net/ogc">
            <And>
              <Or>
                <PropertyIsEqualTo>
                  <PropertyName>ID</PropertyName>
                  <Literal>1</Literal>
                </PropertyIsEqualTo>
                <PropertyIsEqualTo>
                  <PropertyName>ID</PropertyName>
                  <Literal>2</Literal>
                </PropertyIsEqualTo>
              </Or>
              <Or>
                <PropertyIsEqualTo>
                  <PropertyName>STREET</PropertyName>
                  <Literal>Main</Literal>
                </PropertyIsEqualTo>
                <PropertyIsEqualTo>
                  <PropertyName>STREET</PropertyName>
                  <Literal>Time square</Literal>
                </PropertyIsEqualTo>
                <And>
                  <PropertyIsGreaterThanOrEqualTo>
                    <PropertyName>HOUSENO</PropertyName>
                    <Literal>1909</Literal>
                  </PropertyIsGreaterThanOrEqualTo>
                  <PropertyIsLessThanOrEqualTo>
                    <PropertyName>HOUSENO</PropertyName>
                    <Literal>19909</Literal>
                  </PropertyIsLessThanOrEqualTo>
                </And>
              </Or>
            </And>
          </Filter>
          <se:MinScaleDenominator>10000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>20000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#FF0000</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>6</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
