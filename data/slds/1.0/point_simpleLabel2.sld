<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>Styled Label</Name>
    <UserStyle>
      <Title>Styled Label</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Rule 1</Name>
          <TextSymbolizer>
            <Label>
              <ogc:Literal>Your Label</ogc:Literal>
            </Label>
            <Font>
              <CssParameter name="font-size">12</CssParameter>
            </Font>
            <Fill>
              <CssParameter name="fill">#2476ad</CssParameter>
              <CssParameter name="fill-opacity">1</CssParameter>
            </Fill>
          </TextSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
